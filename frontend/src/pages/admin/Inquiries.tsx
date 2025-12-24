import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInquiries = async () => {
        try {
            const res = await api.get('/contact/admin');
            setInquiries(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/contact/admin/${id}`, { status });
            fetchInquiries();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Inquiries</h2>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Event Details</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-10">Loading...</TableCell></TableRow>
                        ) : inquiries.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-10">No inquiries yet.</TableCell></TableRow>
                        ) : (
                            inquiries.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {format(new Date(item.createdAt), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {item.email}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {item.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{item.eventType}</div>
                                        {item.eventDate && <div className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(item.eventDate), 'MMM d, yyyy')}</div>}
                                        {item.eventLocation && <div className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.eventLocation}</div>}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate" title={item.message}>{item.message}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === 'NEW' ? 'default' : item.status === 'SEEN' ? 'secondary' : 'outline'}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {item.status === 'NEW' && (
                                            <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, 'SEEN')}>Mark Seen</Button>
                                        )}
                                        {item.status !== 'ARCHIVED' && (
                                            <Button size="sm" variant="ghost" onClick={() => updateStatus(item.id, 'ARCHIVED')}>Archive</Button>
                                        )}
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

export default Inquiries;
