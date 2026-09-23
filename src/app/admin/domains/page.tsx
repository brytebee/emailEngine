"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Plus, Trash2, Key, Loader2, Lock, LogOut, Users, Globe } from "lucide-react";

interface DomainRecord {
  domain: string;
  createdAt: string;
  isConfigured: boolean;
  revealedKey?: string;
}

interface AdminRecord {
  username: string;
  email: string;
}

export default function DomainsAdminPage() {
  const [token, setToken] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"domains" | "admins">("domains");

  // Add Domain Form State
  const [newDomain, setNewDomain] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [isAddingLoading, setIsAddingLoading] = useState(false);

  // Add Admin Form State
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isAdminAddingLoading, setIsAdminAddingLoading] = useState(false);

  // Verification Prompt State
  const [promptAction, setPromptAction] = useState<{ type: "reveal" | "delete"; domain: string } | null>(null);
  const [promptPassword, setPromptPassword] = useState("");
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [promptError, setPromptError] = useState("");

  // Forgot Password Flow
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const fetchDomains = async (authToken: string) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/domains", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDomains(data);
      } else {
        setError("Failed to fetch domains. Unauthorized.");
        setIsLoggedIn(false);
      }
    } catch (err) {
      setError("An error occurred fetching domains.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdmins = async (authToken: string) => {
    try {
      const res = await fetch("/api/domains/admins", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch (err) {
      console.error("Failed to fetch admins", err);
    }
  };

  const loadDashboardData = async (authToken: string) => {
    await fetchDomains(authToken);
    await fetchAdmins(authToken);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;
    setError("");
    try {
      setIsLoading(true);
      const res = await fetch("/api/domains/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${passwordInput}`
        }
      });
      if (res.ok) {
        setToken(passwordInput);
        setIsLoggedIn(true);
        loadDashboardData(passwordInput);
      } else {
        setError("Invalid admin password");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsLoading(true);
    setForgotMessage("");
    setError("");
    try {
      const res = await fetch("/api/domains/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMessage(data.message);
      } else {
        setError(data.error || "Failed to request reset");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    setIsLoggedIn(false);
    setDomains([]);
    setAdmins([]);
    setPromptAction(null);
    setPasswordInput("");
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain || !newApiKey) return;
    setIsAddingLoading(true);
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ domain: newDomain, apiKey: newApiKey })
      });
      if (res.ok) {
        setNewDomain("");
        setNewApiKey("");
        setIsAddingDomain(false);
        await fetchDomains(token);
      } else {
        alert("Failed to add domain");
      }
    } catch (err) {
      alert("Error adding domain");
    } finally {
      setIsAddingLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername || !newAdminEmail || !newAdminPassword) return;
    setIsAdminAddingLoading(true);
    try {
      const res = await fetch("/api/domains/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username: newAdminUsername, email: newAdminEmail, password: newAdminPassword })
      });
      if (res.ok) {
        setNewAdminUsername("");
        setNewAdminEmail("");
        setNewAdminPassword("");
        setIsAddingAdmin(false);
        await fetchAdmins(token);
      } else {
        alert("Failed to add/update admin");
      }
    } catch (err) {
      alert("Error saving admin");
    } finally {
      setIsAdminAddingLoading(false);
    }
  };

  const handleDeleteAdmin = async (username: string) => {
    if (!confirm(`Are you sure you want to remove admin ${username}?`)) return;
    try {
      const res = await fetch(`/api/domains/admins/${encodeURIComponent(username)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        await fetchAdmins(token);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete admin");
      }
    } catch (err) {
      alert("Error deleting admin");
    }
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptAction || !promptPassword) return;
    
    setPromptError("");
    setIsPromptLoading(true);

    try {
      if (promptAction.type === "delete") {
        const res = await fetch(`/api/domains/${encodeURIComponent(promptAction.domain)}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${promptPassword}`
          }
        });
        if (res.ok) {
          await fetchDomains(token);
          setPromptAction(null);
          setPromptPassword("");
        } else {
          setPromptError(res.status === 401 ? "Incorrect password" : "Failed to delete domain");
        }
      } else if (promptAction.type === "reveal") {
        const res = await fetch("/api/domains/reveal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${promptPassword}`
          },
          body: JSON.stringify({ domain: promptAction.domain })
        });
        if (res.ok) {
          const data = await res.json();
          setDomains(domains.map(d => d.domain === promptAction.domain ? { ...d, revealedKey: data.apiKey } : d));
          setPromptAction(null);
          setPromptPassword("");
        } else {
          setPromptError(res.status === 401 ? "Incorrect password" : "Failed to reveal key");
        }
      }
    } catch (err) {
      setPromptError("An error occurred. Please try again.");
    } finally {
      setIsPromptLoading(false);
    }
  };

  const initiateReveal = (domain: string) => {
    const domainObj = domains.find(d => d.domain === domain);
    if (domainObj?.revealedKey) {
      setDomains(domains.map(d => d.domain === domain ? { ...d, revealedKey: undefined } : d));
      return;
    }
    setPromptAction({ type: "reveal", domain });
    setPromptPassword("");
    setPromptError("");
  };

  const initiateDelete = (domain: string) => {
    setPromptAction({ type: "delete", domain });
    setPromptPassword("");
    setPromptError("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        {isForgotPassword ? (
          <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle>Reset Master Password</CardTitle>
              <CardDescription>Enter your admin email address to receive a secure reset link.</CardDescription>
            </CardHeader>
            <form onSubmit={handleForgotPassword}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {forgotMessage && <p className="text-sm text-green-600 font-medium">{forgotMessage}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pb-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>
                <div className="text-center text-sm">
                  <button type="button" onClick={() => { setIsForgotPassword(false); setForgotMessage(""); setError(""); }} className="text-blue-500 hover:underline">
                    Back to Login
                  </button>
                </div>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle>Domain Management Access</CardTitle>
              <CardDescription>Enter the master password to manage email domains and API keys.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Master Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pb-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Authenticating..." : "Access Dashboard"}
                </Button>
                <div className="text-center text-sm">
                  <button type="button" onClick={() => setIsForgotPassword(true)} className="text-blue-500 hover:underline">
                    Forgot Password?
                  </button>
                </div>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 relative">
      {/* Verification Modal Overlay */}
      {promptAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 fade-in-0 duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5 text-gray-500" />
                Security Verification
              </CardTitle>
              <CardDescription>
                Please verify your master password to {promptAction.type === "reveal" ? "reveal the API key for" : "delete"} <strong>{promptAction.domain}</strong>.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePromptSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verifyPassword">Master Password</Label>
                    <Input 
                      id="verifyPassword" 
                      type="password" 
                      placeholder="Enter master password"
                      value={promptPassword}
                      onChange={(e) => setPromptPassword(e.target.value)}
                      disabled={isPromptLoading}
                      autoFocus
                    />
                  </div>
                  {promptError && <p className="text-sm text-red-500 font-medium">{promptError}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setPromptAction(null)}
                  disabled={isPromptLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant={promptAction.type === "delete" ? "destructive" : "default"}
                  disabled={isPromptLoading}
                >
                  {isPromptLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify & {promptAction.type === "reveal" ? "Reveal" : "Delete"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Manage email domains and admin accounts securely.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleLogout} title="Logout">
              <LogOut className="h-4 w-4 sm:mr-2" /> 
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("domains")}
            className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "domains" 
                ? "border-black text-black dark:border-white dark:text-white" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Globe className="mr-2 h-4 w-4" /> Domains
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "admins" 
                ? "border-black text-black dark:border-white dark:text-white" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Users className="mr-2 h-4 w-4" /> Admins
          </button>
        </div>

        {activeTab === "domains" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-end">
              <Button onClick={() => setIsAddingDomain(!isAddingDomain)} disabled={isLoading || isAddingLoading}>
                {isAddingDomain ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Add Domain</>}
              </Button>
            </div>

            {isAddingDomain && (
              <Card className="border-blue-200 dark:border-blue-900 shadow-sm animate-in slide-in-from-top-2 fade-in-20 duration-200">
                <CardHeader>
                  <CardTitle>Add New Domain</CardTitle>
                  <CardDescription>Enter the domain name and its corresponding Resend API Key.</CardDescription>
                </CardHeader>
                <form onSubmit={handleAddDomain}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="domainName">Domain Name</Label>
                      <Input 
                        id="domainName" 
                        placeholder="e.g. example.com" 
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        required
                        disabled={isAddingLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">Resend API Key</Label>
                      <Input 
                        id="apiKey" 
                        type="password" 
                        placeholder="re_..." 
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        required
                        disabled={isAddingLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" type="button" onClick={() => setIsAddingDomain(false)} disabled={isAddingLoading}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isAddingLoading}>
                      {isAddingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isAddingLoading ? "Saving..." : "Save Domain"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}

            <div className="grid gap-6 relative">
              {isLoading && domains.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : domains.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                  <Key className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold">No domains configured</h3>
                  <p className="mt-2 text-gray-500">Add a domain to get started with email services.</p>
                </div>
              ) : (
                <>
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                  )}
                  {domains.map((domain) => (
                    <Card key={domain.domain} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6 sm:flex sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="space-y-1">
                          <h3 className="text-lg font-medium flex items-center">
                            {domain.domain}
                          </h3>
                          <p className="text-sm text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block mt-1">
                            {domain.revealedKey ? domain.revealedKey : "re_••••••••••••••••••••••••••••••••"}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Added on {new Date(domain.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => initiateReveal(domain.domain)}
                          >
                            {domain.revealedKey ? (
                              <><EyeOff className="mr-2 h-4 w-4" /> Hide</>
                            ) : (
                              <><Eye className="mr-2 h-4 w-4" /> Reveal</>
                            )}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => initiateDelete(domain.domain)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "admins" && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="flex justify-end">
              <Button onClick={() => setIsAddingAdmin(!isAddingAdmin)} disabled={isLoading || isAdminAddingLoading}>
                {isAddingAdmin ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Add Admin</>}
              </Button>
            </div>

            {isAddingAdmin && (
              <Card className="border-green-200 dark:border-green-900 shadow-sm animate-in slide-in-from-top-2 fade-in-20 duration-200">
                <CardHeader>
                  <CardTitle>Add or Update Admin</CardTitle>
                  <CardDescription>If the username exists, it will update their email and password.</CardDescription>
                </CardHeader>
                <form onSubmit={handleAddAdmin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminUsername">Username</Label>
                      <Input 
                        id="adminUsername" 
                        placeholder="e.g. admin" 
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        required
                        disabled={isAdminAddingLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email Address</Label>
                      <Input 
                        id="adminEmail" 
                        type="email"
                        placeholder="admin@example.com" 
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        required
                        disabled={isAdminAddingLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminPassword">Master Password</Label>
                      <Input 
                        id="adminPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        required
                        disabled={isAdminAddingLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" type="button" onClick={() => setIsAddingAdmin(false)} disabled={isAdminAddingLoading}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isAdminAddingLoading}>
                      {isAdminAddingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isAdminAddingLoading ? "Saving..." : "Save Admin"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}

            <div className="grid gap-6 relative">
              {admins.length === 0 && !isLoading ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold">No admins found</h3>
                </div>
              ) : (
                admins.map((admin) => (
                  <Card key={admin.username} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6 sm:flex sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">{admin.username}</h3>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteAdmin(admin.username)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
