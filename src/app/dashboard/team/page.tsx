"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Plus, 
  Mail, 
  Shield, 
  MoreVertical, 
  Search, 
  UserPlus,
  Loader2,
  Trash2,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'staff';
  title: string;
  createdAt: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [newEmail, setNewEmail] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchTeam = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard/team");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Failed to fetch team:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch("/api/dashboard/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          fullName: newFullName,
          title: newTitle,
          password: newPassword,
          role: 'staff'
        })
      });

      if (res.ok) {
        setNewEmail("");
        setNewFullName("");
        setNewTitle("");
        setNewPassword("");
        setShowAddForm(false);
        fetchTeam();
      }
    } catch (error) {
      console.error("Add team member error:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Team</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your staff and their professional email access.</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 h-12 shadow-lg shadow-indigo-100 dark:shadow-none font-bold transition-all active:scale-95"
        >
          {showAddForm ? "Cancel Overview" : "Add Team Member"} <UserPlus className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {showAddForm && (
        <Card className="rounded-[2.5rem] border-indigo-200 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden animate-in slide-in-from-top-4 duration-500">
           <CardHeader className="p-10 pb-4 text-center">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                 <UserPlus className="w-8 h-8" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tight">Onboard Staff Member</CardTitle>
              <CardDescription>Created staff will immediately gain access to their business workspace.</CardDescription>
           </CardHeader>
           <CardContent className="p-10 space-y-6">
              <form onSubmit={handleAddMember} className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <Label>Full Name</Label>
                    <Input 
                      placeholder="Jane Doe" 
                      className="h-14 rounded-2xl bg-slate-50 border-none px-6" 
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      required
                    />
                 </div>
                 <div className="space-y-3">
                    <Label>Professional Title</Label>
                    <Input 
                      placeholder="Senior Account Manager" 
                      className="h-14 rounded-2xl bg-slate-50 border-none px-6" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                 </div>
                 <div className="space-y-3">
                    <Label>Workspace Email</Label>
                    <Input 
                      type="email"
                      placeholder="jane@organization.com" 
                      className="h-14 rounded-2xl bg-slate-50 border-none px-6" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                 </div>
                 <div className="space-y-3">
                    <Label>Initial Password</Label>
                    <Input 
                      type="password"
                      placeholder="••••••••" 
                      className="h-14 rounded-2xl bg-slate-50 border-none px-6" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                 </div>
                 <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
                    <Button type="button" variant="ghost" className="h-14 px-8 rounded-2xl font-bold" onClick={() => setShowAddForm(false)}>
                       Discard
                    </Button>
                    <Button type="submit" disabled={isAdding} className="h-14 px-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all active:scale-95">
                       {isAdding ? <Loader2 className="w-6 h-6 animate-spin" /> : "Complete Onboarding"}
                    </Button>
                 </div>
              </form>
           </CardContent>
        </Card>
      )}

      {/* Member List */}
      <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
           <div>
              <CardTitle className="text-2xl font-black">All Team Members</CardTitle>
              <CardDescription>Overview of all active accounts in your professional ecosystem.</CardDescription>
           </div>
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search staff..." 
                className="pl-10 h-10 rounded-xl border-slate-100 bg-slate-50" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </CardHeader>
        <CardContent className="p-10 pt-0">
           {isLoading ? (
              <div className="flex items-center justify-center py-20">
                 <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
              </div>
           ) : filteredMembers.length === 0 ? (
              <div className="text-center py-20 space-y-4 opacity-50">
                 <Users className="w-14 h-14 mx-auto text-slate-300" />
                 <p className="text-lg font-bold text-slate-400">No team members found.</p>
              </div>
           ) : (
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-slate-100">
                          <th className="py-6 px-4 text-sm font-bold text-slate-400 uppercase tracking-widest">Name & Title</th>
                          <th className="py-6 px-4 text-sm font-bold text-slate-400 uppercase tracking-widest">Email Address</th>
                          <th className="py-6 px-4 text-sm font-bold text-slate-400 uppercase tracking-widest">Role</th>
                          <th className="py-6 px-4 text-sm font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
                          <th className="py-6 px-4 text-right"></th>
                       </tr>
                    </thead>
                    <tbody>
                       {filteredMembers.map((member) => (
                          <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                             <td className="py-6 px-4">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600">
                                      {member.fullName[0]}
                                   </div>
                                   <div>
                                      <p className="font-bold text-slate-900 truncate">{member.fullName}</p>
                                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{member.title}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="py-6 px-4">
                                <div className="flex items-center gap-2 font-bold text-slate-600">
                                   <Mail className="w-4 h-4 opacity-40" />
                                   {member.email}
                                </div>
                             </td>
                             <td className="py-6 px-4">
                                <Badge className={
                                   member.role === 'admin' 
                                   ? "bg-indigo-50 text-indigo-600 border-indigo-100 font-bold" 
                                   : "bg-slate-50 text-slate-600 border-slate-100 font-bold"
                                }>
                                   {member.role === 'admin' ? <Shield className="w-3 h-3 mr-1.5" /> : null}
                                   {member.role}
                                </Badge>
                             </td>
                             <td className="py-6 px-4 font-medium text-slate-500 text-sm">
                                {new Date(member.createdAt).toLocaleDateString()}
                             </td>
                             <td className="py-6 px-4 text-right">
                                <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white">
                                         <MoreVertical className="w-4 h-4 text-slate-400" />
                                      </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                      <DropdownMenuItem className="rounded-xl text-red-600 focus:text-red-700 cursor-pointer">
                                         <Trash2 className="w-4 h-4 mr-2" /> Revoke Access
                                      </DropdownMenuItem>
                                   </DropdownMenuContent>
                                </DropdownMenu>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
