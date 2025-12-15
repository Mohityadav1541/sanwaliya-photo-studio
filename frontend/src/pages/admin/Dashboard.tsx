import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, MessageSquare, Eye } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalMedia: 0,
        totalInquiries: 0,
        newInquiries: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real app we'd have a dashboard stats endpoint, 
                // but here we can just fetch counts or do a quick calculation if the data is small,
                // or just leave as placeholders for now.
                // For now let's just show static or fetched lists count.
                const mediaRes = await api.get('/media?limit=1');
                const inquiriesRes = await api.get('/contact/admin');
                const inquiries = inquiriesRes.data || [];
                
                setStats({
                    totalMedia: mediaRes.data.total || 0,
                    totalInquiries: inquiries.length,
                    newInquiries: inquiries.filter((i: any) => i.status === 'NEW').length
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
            
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Media</CardTitle>
                        <Image className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalMedia}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalInquiries}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Messages</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.newInquiries}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
