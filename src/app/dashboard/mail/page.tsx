"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Inbox, 
  Send, 
  Trash2, 
  Search, 
  MoreHorizontal, 
  Archive, 
  RefreshCcw, 
  Paperclip,
  Image as ImageIcon,
  SendHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Mail,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  mailboxId: string;
  direction: 'in' | 'out';
  subject: string;
  htmlBody: string;
  attachmentsJson: string;
  from: string;
  to: string;
  timestamp: string;
}

export default function WebmailPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent'>('inbox');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Compose State
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard/mail");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        if (data.length > 0 && !selectedMessage) {
            setSelectedMessage(data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch mail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(m => {
    const matchesFolder = activeFolder === 'inbox' ? m.direction === 'in' : m.direction === 'out';
    const matchesSearch = m.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.to.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Send logic will hit the mail routing engine in Phase 5
    // For now, we simulate success
    setTimeout(() => {
        setIsSending(false);
        setIsComposeOpen(false);
        setTo("");
        setSubject("");
        setContent("");
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-500 animate-in fade-in zoom-in-95">
      
      {/* 1. Mail Folders Sidebar */}
      <div className="w-20 lg:w-64 border-r border-slate-100 dark:border-slate-800 flex flex-col p-4">
        <Button 
          onClick={() => setIsComposeOpen(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-14 shadow-lg shadow-indigo-100 dark:shadow-none mb-6 group"
        >
          <Plus className="w-5 h-5 lg:mr-2 group-hover:rotate-90 transition-transform" />
          <span className="hidden lg:inline font-semibold">Compose</span>
        </Button>

        <nav className="space-y-1">
          <button 
            onClick={() => setActiveFolder('inbox')}
            className={cn(
              "w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl transition-all",
              activeFolder === 'inbox' 
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold" 
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            )}
          >
            <Inbox className="w-5 h-5" />
            <span className="hidden lg:inline">Inbox</span>
            <Badge className="ml-auto hidden lg:flex bg-indigo-600 text-[10px] h-5 px-1.5 min-w-5 justify-center">12</Badge>
          </button>
          <button 
            onClick={() => setActiveFolder('sent')}
            className={cn(
              "w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl transition-all",
              activeFolder === 'sent' 
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold" 
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            )}
          >
            <Send className="w-5 h-5" />
            <span className="hidden lg:inline">Sent</span>
          </button>
          <button className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
            <Trash2 className="w-5 h-5" />
            <span className="hidden lg:inline">Trash</span>
          </button>
        </nav>
      </div>

      {/* 2. Message List */}
      <div className="w-full lg:w-[400px] border-r border-slate-100 dark:border-slate-800 hidden sm:flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search mail..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl"
            />
          </div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
            <span>{activeFolder}</span>
            <RefreshCcw 
                className="w-3.5 h-3.5 cursor-pointer hover:rotate-180 transition-transform duration-500" 
                onClick={fetchMessages}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-4 space-y-4">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-20 bg-slate-50 dark:bg-slate-800/40 rounded-2xl animate-pulse" />
                ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 opacity-50 space-y-2">
              <Inbox className="w-12 h-12" />
              <p className="text-sm">Your {activeFolder} is empty</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                    selectedMessage?.id === msg.id 
                      ? "bg-slate-100 dark:bg-slate-800 shadow-sm" 
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-bold text-sm truncate pr-4 text-slate-900 dark:text-slate-100">
                      {msg.direction === 'in' ? msg.from : `To: ${msg.to}`}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 shrink-0">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate mb-1">
                    {msg.subject || "(No Subject)"}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed h-[34px]">
                    {msg.htmlBody.replace(/<[^>]*>/g, '')}
                  </div>
                  {selectedMessage?.id === msg.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* 3. Message Detail */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 relative">
        {selectedMessage ? (
          <>
            {/* Detail Toolbar */}
            <header className="h-16 lg:h-20 p-4 lg:px-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-indigo-600">
                  <Archive className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-red-600">
                  <Trash2 className="w-5 h-5" />
                </Button>
                <Separator orientation="vertical" className="h-6 mx-2" />
                <Button variant="ghost" size="icon" className="rounded-xl text-slate-400">
                  <Paperclip className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-xs font-medium text-slate-400 mr-4">
                   1 of {filteredMessages.length}
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </header>

            {/* Content Scroll Area */}
            <ScrollArea className="flex-1 p-6 lg:p-12">
              <div className="max-w-3xl mx-auto space-y-10">
                <div className="space-y-4">
                  <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    {selectedMessage.subject || "(No Subject)"}
                  </h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <UserIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{selectedMessage.from}</span>
                          {selectedMessage.direction === 'in' && <Badge className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20 text-[10px] py-0 px-2 h-4 rounded-full border">CONTACT</Badge>}
                        </div>
                        <div className="text-xs text-slate-400 leading-none mt-1">
                          to {selectedMessage.to}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                        {new Date(selectedMessage.timestamp).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div 
                  className="text-base leading-relaxed text-slate-800 dark:text-slate-200 prose dark:prose-invert max-w-none prose-p:my-4 prose-a:text-indigo-600"
                  dangerouslySetInnerHTML={{ __html: selectedMessage.htmlBody }}
                />

                <Separator className="mt-12 mb-6" />
                <div className="flex items-center gap-4">
                   <Button className="rounded-xl px-8 h-12 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 dark:shadow-none font-bold">Reply Message</Button>
                   <Button variant="outline" className="rounded-xl px-8 h-12 border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-800">Forward</Button>
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 p-12 text-center select-none">
            <Mail className="w-32 h-32 mb-8 stroke-[0.5px] opacity-20" />
            <h3 className="text-2xl font-bold tracking-tight mb-2">Select a message to read</h3>
            <p className="max-w-sm text-lg text-slate-400 dark:text-slate-600">Choose a message from the list on the left to view its full content and attachments.</p>
          </div>
        )}

        {/* --- Compose Modal Overlay --- */}
        {isComposeOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <Card className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
              <form onSubmit={handleSend}>
                <CardHeader className="flex flex-row items-center justify-between pb-8 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                   <div>
                    <CardTitle className="text-2xl font-black tracking-tight">New Message</CardTitle>
                    <CardDescription>Compose a professional email to your recipients.</CardDescription>
                   </div>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsComposeOpen(false)}
                    className="rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500"
                   >
                    <X className="w-6 h-6" />
                   </Button>
                </CardHeader>
                <CardContent className="space-y-6 pt-8 pb-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-400 w-12 text-right">To</span>
                      <Input 
                        placeholder="recipient@example.com" 
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="flex-1 h-12 bg-slate-50/50 dark:bg-slate-950/50 border-none rounded-xl focus-visible:ring-indigo-500"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-400 w-12 text-right">Sub</span>
                      <Input 
                        placeholder="Subject of your message" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="flex-1 h-12 bg-slate-50/50 dark:bg-slate-950/50 border-none rounded-xl focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <Textarea 
                      placeholder="Write your brilliant content here..." 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[300px] bg-slate-50/20 dark:bg-slate-950/20 border-slate-100 dark:border-slate-800 rounded-3xl p-6 text-lg tracking-tight resize-none focus-visible:ring-indigo-500 transition-all duration-300"
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-400 hover:text-indigo-600 transition-colors">
                            <ImageIcon className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 justify-between items-center">
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 group-hover:animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Autosaved</span>
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-indigo-600 hover:bg-indigo-700 h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 dark:shadow-none gap-3 transition-all active:scale-95"
                    disabled={isSending}
                  >
                    {isSending ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>Send Message <SendHorizontal className="w-5 h-5" /></>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
