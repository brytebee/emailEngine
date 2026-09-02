"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Globe, 
  Plus, 
  ShieldCheck, 
  Clock, 
  Trash2, 
  RefreshCcw, 
  ExternalLink,
  Search,
  MoreVertical,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Domain {
  id: string;
  domainName: string;
  resendDomainId: string;
  status: 'pending' | 'verified';
  createdAt: string;
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDomains = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard/domains");
      if (res.ok) {
        const data = await res.json();
        setDomains(data);
      }
    } catch (error) {
      console.error("Failed to fetch domains:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const filteredDomains = domains.filter(d => 
    d.domainName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Domains</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your business domains and email routing settings.</p>
        </div>
        <Link href="/dashboard/domains/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 h-12 shadow-md shadow-indigo-100 dark:shadow-none">
            <Plus className="w-5 h-5 mr-2" /> Add Domain
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search domains..." 
            className="pl-10 border-none shadow-none bg-transparent focus-visible:ring-0 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden md:block" />
        <Button variant="ghost" size="sm" className="hidden md:flex text-slate-500 hover:text-slate-900" onClick={fetchDomains}>
          <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredDomains.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent py-20 text-center">
          <CardContent className="space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <Globe className="w-10 h-10 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">No domains found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                {searchQuery ? `We couldn't find any domains matching "${searchQuery}"` : "Get started by adding your first business domain."}
              </p>
            </div>
            {!searchQuery && (
              <Link href="/dashboard/domains/new">
                <Button variant="outline" className="rounded-xl mt-4">
                  Add New Domain
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDomains.map((domain) => (
            <Card key={domain.id} className="group border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 shadow-sm hover:shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden rounded-3xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-slate-100 dark:border-slate-800 p-1">
                      <DropdownMenuItem className="rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Domain
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl tracking-tight leading-none truncate mb-1">{domain.domainName}</CardTitle>
                <div className="flex items-center gap-2">
                  {domain.status === "verified" ? (
                    <Badge className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20 hover:bg-green-50 py-0.5 rounded-full font-medium flex items-center gap-1 border">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </Badge>
                  ) : domain.resendDomainId === "MANUAL" ? (
                    <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20 py-0.5 rounded-full font-medium flex items-center gap-1 border animate-pulse">
                      <Clock className="w-3 h-3" /> Managed Setup
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20 py-0.5 rounded-full font-medium flex items-center gap-1 border">
                      <Clock className="w-3 h-3" /> Pending DNS
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="text-sm text-slate-500 mb-6">
                  Added on {new Date(domain.createdAt).toLocaleDateString()}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="rounded-xl text-xs h-9 gap-1.5 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <ExternalLink className="w-3.5 h-3.5" /> DNS Settings
                  </Button>
                  {domain.resendDomainId === "MANUAL" ? (
                    <Button variant="ghost" className="rounded-xl text-xs h-9 gap-1.5 text-indigo-600 dark:text-indigo-400 opacity-50 cursor-not-allowed">
                       Setup in Progress
                    </Button>
                  ) : (
                    <Button variant="ghost" className="rounded-xl text-xs h-9 gap-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                      Verify Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-slate-900 dark:bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Email Authentication</h3>
          </div>
          <p className="text-slate-300 dark:text-indigo-100 leading-relaxed">
            Unverified domains cannot send or receive emails to protect our platform integrity. After adding DNS records, please click "Verify Now" to activate your domain.
          </p>
          <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-semibold px-6 h-11">
            Read Documentation
          </Button>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50" />
        <Globe className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
      </div>
    </div>
  );
}
