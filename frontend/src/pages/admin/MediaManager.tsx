import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const MediaManager = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Weddings');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
    const [type, setType] = useState('IMAGE'); // IMAGE or VIDEO
    const [videoUrl, setVideoUrl] = useState('');

    const fetchMedia = async () => {
        try {
            const res = await api.get('/media?limit=100');
            setMedia(res.data.items);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            // Handle Video URL case (no file)
            if (type === 'VIDEO' && videoUrl && (!files || files.length === 0)) {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('category', category);
                formData.append('description', description);
                formData.append('type', type);
                formData.append('externalUrl', videoUrl);

                await api.post('/media/admin', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            // Handle File uploads (Multiple)
            else if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const formData = new FormData();
                    formData.append('title', files.length > 1 ? `${title} (${i + 1})` : title);
                    formData.append('category', category);
                    formData.append('description', description);
                    formData.append('type', type);
                    formData.append('file', file);

                    if (type === 'VIDEO' && videoUrl) {
                        formData.append('externalUrl', videoUrl);
                    }

                    await api.post('/media/admin', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                }
            }

            toast({ title: 'Success', description: 'Media uploaded successfully' });
            setOpen(false);
            fetchMedia();
            // Reset form
            setTitle('');
            setDescription('');
            setFiles(null);
            setVideoUrl('');
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Upload failed',
                variant: 'destructive'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/media/admin/${id}`);
            toast({ title: 'Deleted', description: 'Item removed successfully' });
            fetchMedia();
        } catch (error) {
            toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Media Manager</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Media</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Add New Media</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Weddings">Weddings</SelectItem>
                                        <SelectItem value="Pre-Wedding">Pre-Wedding</SelectItem>
                                        <SelectItem value="Cinematic Videos">Cinematic Videos</SelectItem>
                                        <SelectItem value="Candid">Candid</SelectItem>
                                        <SelectItem value="Albums">Albums</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IMAGE">Image</SelectItem>
                                        <SelectItem value="VIDEO">Video</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {type === 'IMAGE' ? (
                                <div className="space-y-2">
                                    <Label>Image Files (Select Multiple)</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={e => setFiles(e.target.files)}
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label>Video URL (YouTube/External)</Label>
                                    <Input
                                        placeholder="https://youtube.com/..."
                                        value={videoUrl}
                                        onChange={e => setVideoUrl(e.target.value)}
                                    />
                                    {/* Optional thumbnail upload for video */}
                                    <Label>Thumbnail (Optional)</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={e => setFiles(e.target.files)}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={description} onChange={e => setDescription(e.target.value)} />
                            </div>

                            <Button type="submit" className="w-full" disabled={uploading}>
                                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Upload
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : media.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">No items found.</TableCell>
                            </TableRow>
                        ) : (
                            media.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.type === 'IMAGE' || (item.type === 'VIDEO' && item.fileUrl) ? (
                                            <img
                                                src={item.fileUrl ? (item.fileUrl.startsWith('http') ? item.fileUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.fileUrl}`) : ''}
                                                alt={item.title}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded">Video</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MediaManager;
