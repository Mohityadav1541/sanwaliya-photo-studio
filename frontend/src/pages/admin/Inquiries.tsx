import { useState, useEffect } from "react";
import api from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MessageSquare, Phone, Mail, MapPin, Calendar, CheckCircle2, Clock } from "lucide-react";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const res = await api.get("/contact/admin");
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
    <div className="space-y-6 font-sans text-[#181817]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#181817]/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D9381E] block mb-1">
            Client Registry &middot; Inquiries
          </span>
          <h2 className="font-serif text-3xl font-normal text-[#181817]">Client Inquiries</h2>
        </div>
        <div className="text-xs text-[#6E6A63] font-mono">
          Total Inquiries: {inquiries.length}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="rounded-2xl border border-[#181817]/10 bg-white/85 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FAF8F5] border-b border-[#181817]/10">
            <TableRow className="border-[#181817]/10 hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono">
                Date
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono">
                Client
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono">
                Event / Service
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono">
                Message &amp; Prints
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono">
                Status
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-[#181817]/10">
                <TableCell colSpan={6} className="text-center py-12 text-[#6E6A63] font-mono text-xs">
                  Loading Inquiries...
                </TableCell>
              </TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow className="border-[#181817]/10">
                <TableCell colSpan={6} className="text-center py-12 text-[#6E6A63] font-mono text-xs">
                  No inquiries received yet.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry: any) => (
                <TableRow key={inquiry.id} className="border-[#181817]/10 hover:bg-[#FAF8F5]/50">
                  <TableCell className="text-xs font-mono text-[#6E6A63]">
                    {format(new Date(inquiry.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-[#181817] text-sm">{inquiry.name}</div>
                    <div className="text-xs text-[#6E6A63] flex items-center gap-1 mt-0.5 font-mono">
                      <Mail className="w-3 h-3 text-[#D9381E]" />
                      <span>{inquiry.email}</span>
                    </div>
                    {inquiry.phone && (
                      <div className="text-xs text-[#6E6A63] flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-[#C5A880]" />
                        <span>{inquiry.phone}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal border-[#181817]/15 bg-[#FAF8F5] text-[#181817]">
                      {inquiry.eventType || inquiry.service || "Wedding Photography"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-xs text-[#6E6A63] line-clamp-2">{inquiry.message}</p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                        inquiry.status === "NEW"
                          ? "bg-[#D9381E]/10 text-[#D9381E] border border-[#D9381E]/20"
                          : inquiry.status === "CONTACTED"
                          ? "bg-[#C5A880]/15 text-[#8C6D37] border border-[#C5A880]/30"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inquiry.status === "NEW" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatus(inquiry.id, "CONTACTED")}
                          className="h-8 text-xs text-[#181817] hover:bg-[#FAF8F5] font-mono"
                        >
                          Mark Contacted
                        </Button>
                      )}
                      {inquiry.status !== "COMPLETED" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatus(inquiry.id, "COMPLETED")}
                          className="h-8 text-xs text-emerald-700 hover:bg-emerald-50 font-mono"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
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
