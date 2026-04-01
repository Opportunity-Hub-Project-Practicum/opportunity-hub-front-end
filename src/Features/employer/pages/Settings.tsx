import { useState } from "react";
import type { ReactNode } from "react";
import {
  AtSign,
  Bold,
  CalendarDays,
  CircleX,
  Eye,
  Globe,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Lock,
  Mail,
  MapPin,
  Settings as SettingsIcon,
  Underline,
  UserRound,
} from "lucide-react";

import { Layout } from "../component/Layout";
import { Input } from "../component/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../component/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { Textarea } from "../component/textarea";

type SettingsTab = "company-info" | "detail" | "account-setting";

type SocialLink = {
  platform: string;
  url: string;
};

const toolbarButtons = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  { icon: LinkIcon, label: "Insert link" },
  { icon: List, label: "Bullet list" },
  { icon: ListOrdered, label: "Numbered list" },
] as const;

function SettingsField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function RichTextToolbar() {
  return (
    <div className="flex items-center gap-1 border border-t-0 border-slate-200 px-3 py-2 text-slate-400">
      {toolbarButtons.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className="rounded p-1 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

function PasswordField({
  label,
  value,
  visible,
  onChange,
  onToggleVisibility,
}: {
  label: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}) {
  return (
    <SettingsField label={label}>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Password"
          className="h-11 border-slate-200 pr-10"
        />
        <button
          type="button"
          aria-label={`Toggle ${label.toLowerCase()} visibility`}
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </SettingsField>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("company-info");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    companyName: "Instagram",
    about: "we are instagram, a platform that help people connect",
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "Facebook", url: "instagram.com/yourusername" },
    { platform: "Instagram", url: "instagram.com/yourusername" },
  ]);

  const [detailInfo, setDetailInfo] = useState({
    organizationType: "Corporate",
    industryType: "Digital Media",
    teamSize: "200-300 employees",
    established: "15/03/2001",
    website: "https://www.yourcompany.com",
    vision:
      "To redefine visual storytelling by helping brands build authentic, high-engagement communities through creative digital content and strategic social growth.",
    mapLocation: "addresmap.com",
    phone: "028 842 3298",
    email: "instagram@gmail.com",
  });

  const [accountInfo, setAccountInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string,
  ) => {
    setSocialLinks((current) =>
      current.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link,
      ),
    );
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks((current) => current.filter((_, linkIndex) => linkIndex !== index));
  };

  const addSocialLink = () => {
    setSocialLinks((current) => [
      ...current,
      { platform: "LinkedIn", url: "linkedin.com/company/yourcompany" },
    ]);
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 p-6 text-white shadow-lg shadow-blue-900/10 md:p-8">
          <div className="max-w-3xl space-y-2">
            <p className="text-sm font-medium text-blue-100">Company workspace</p>
            <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
            <p className="text-sm leading-6 text-blue-50/90 md:text-base">
              Keep your employer profile polished, accurate, and easy for candidates to trust.
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as SettingsTab)}
          className="w-full"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm">
            <TabsTrigger
              value="company-info"
              className="rounded-xl border border-transparent px-4 py-3 text-sm font-medium shadow-none data-[state=active]:border-blue-100 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
            >
              <UserRound className="mr-2 h-3.5 w-3.5" />
              Company Info
            </TabsTrigger>
            <TabsTrigger
              value="detail"
              className="rounded-xl border border-transparent px-4 py-3 text-sm font-medium shadow-none data-[state=active]:border-blue-100 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
            >
              <SettingsIcon className="mr-2 h-3.5 w-3.5" />
              Detail
            </TabsTrigger>
            <TabsTrigger
              value="account-setting"
              className="rounded-xl border border-transparent px-4 py-3 text-sm font-medium shadow-none data-[state=active]:border-blue-100 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
            >
              <Lock className="mr-2 h-3.5 w-3.5" />
              Account Setting
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company-info" className="pt-6">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-slate-900">Brand profile</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Update the logo and links candidates will see first.
                  </p>
                </div>

                <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
                  <div className="flex flex-col items-start gap-3">
                    <div className="flex h-44 w-44 items-center justify-center rounded-[32px] bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] text-white shadow-sm ring-8 ring-slate-50">
                      <AtSign className="h-16 w-16" strokeWidth={1.8} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>4.3 MB</span>
                      <button type="button" className="text-slate-600 hover:text-slate-900">
                        Remove
                      </button>
                      <button type="button" className="text-blue-600 hover:text-blue-700">
                        Replace
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    {socialLinks.map((link, index) => (
                      <div key={`${link.platform}-${index}`} className="space-y-1.5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Social Link {index + 1}
                        </p>
                        <div className="grid gap-3 md:grid-cols-[200px_minmax(0,1fr)_44px]">
                          <Select
                            value={link.platform}
                            onValueChange={(value) =>
                              updateSocialLink(index, "platform", value)
                            }
                          >
                            <SelectTrigger className="h-11 border-slate-200 text-sm">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Facebook">Facebook</SelectItem>
                              <SelectItem value="Instagram">Instagram</SelectItem>
                              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                              <SelectItem value="X">X</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            value={link.url}
                            onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                            className="h-11 border-slate-200 text-sm"
                          />

                          <button
                            type="button"
                            aria-label={`Remove social link ${index + 1}`}
                            onClick={() => removeSocialLink(index)}
                            className="flex h-11 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-rose-500"
                          >
                            <CircleX className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                    >
                      <ImagePlus className="h-4 w-4" />
                      Add New Social Link
                    </button>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-slate-900">Company story</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Help candidates understand who you are and why they should join.
                  </p>
                </div>

                <div className="space-y-5">
                <SettingsField label="Company name">
                  <Input
                    value={companyInfo.companyName}
                    onChange={(e) =>
                      setCompanyInfo((current) => ({
                        ...current,
                        companyName: e.target.value,
                      }))
                    }
                    className="h-11 max-w-xl border-slate-200"
                  />
                </SettingsField>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-700">About us</span>
                  <Textarea
                    value={companyInfo.about}
                    onChange={(e) =>
                      setCompanyInfo((current) => ({
                        ...current,
                        about: e.target.value,
                      }))
                    }
                    rows={6}
                    className="min-h-[170px] resize-none rounded-b-none border-slate-200"
                  />
                  <RichTextToolbar />
                </div>
                </div>
              </section>

              <div className="sticky bottom-4 flex justify-end">
                <button
                  type="submit"
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Save Change
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="detail" className="pt-6">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-slate-900">Business details</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Share the basics candidates use to evaluate your company.
                  </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                <SettingsField label="Organization Type">
                  <Select
                    value={detailInfo.organizationType}
                    onValueChange={(value) =>
                      setDetailInfo((current) => ({
                        ...current,
                        organizationType: value,
                      }))
                    }
                  >
                    <SelectTrigger className="h-11 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                      <SelectItem value="Startup">Startup</SelectItem>
                      <SelectItem value="NGO">NGO</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingsField>

                <SettingsField label="Industry Types">
                  <Select
                    value={detailInfo.industryType}
                    onValueChange={(value) =>
                      setDetailInfo((current) => ({
                        ...current,
                        industryType: value,
                      }))
                    }
                  >
                    <SelectTrigger className="h-11 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Digital Media">Digital Media</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingsField>

                <SettingsField label="Team Size">
                  <Select
                    value={detailInfo.teamSize}
                    onValueChange={(value) =>
                      setDetailInfo((current) => ({
                        ...current,
                        teamSize: value,
                      }))
                    }
                  >
                    <SelectTrigger className="h-11 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-20 employees">1-20 employees</SelectItem>
                      <SelectItem value="20-100 employees">20-100 employees</SelectItem>
                      <SelectItem value="200-300 employees">200-300 employees</SelectItem>
                      <SelectItem value="300+ employees">300+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingsField>

                <SettingsField label="Year of Establishment">
                  <div className="relative">
                    <Input
                      value={detailInfo.established}
                      onChange={(e) =>
                        setDetailInfo((current) => ({
                          ...current,
                          established: e.target.value,
                        }))
                      }
                      className="h-11 border-slate-200 pr-10"
                    />
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </SettingsField>

                <SettingsField label="Company Website">
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={detailInfo.website}
                      onChange={(e) =>
                        setDetailInfo((current) => ({
                          ...current,
                          website: e.target.value,
                        }))
                      }
                      className="h-11 border-slate-200 pl-9"
                    />
                  </div>
                </SettingsField>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-slate-900">Vision</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Describe your direction and what makes the company meaningful.
                  </p>
                </div>

                <div className="space-y-2">
                <span className="text-xs font-medium text-slate-700">Company Vision</span>
                <Textarea
                  value={detailInfo.vision}
                  onChange={(e) =>
                    setDetailInfo((current) => ({
                      ...current,
                      vision: e.target.value,
                    }))
                  }
                  rows={5}
                  className="min-h-[140px] resize-none rounded-b-none border-slate-200"
                />
                <RichTextToolbar />
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-slate-900">Contact Information</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Make it easy for applicants and partners to reach you.
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                <SettingsField label="Map Location">
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={detailInfo.mapLocation}
                      onChange={(e) =>
                        setDetailInfo((current) => ({
                          ...current,
                          mapLocation: e.target.value,
                        }))
                      }
                      className="h-11 border-slate-200 pl-9"
                    />
                  </div>
                </SettingsField>

                <SettingsField label="Phone">
                  <Input
                    value={detailInfo.phone}
                    onChange={(e) =>
                      setDetailInfo((current) => ({
                        ...current,
                        phone: e.target.value,
                      }))
                    }
                    className="h-11 border-slate-200"
                  />
                </SettingsField>

                <SettingsField label="Email">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="email"
                      value={detailInfo.email}
                      onChange={(e) =>
                        setDetailInfo((current) => ({
                          ...current,
                          email: e.target.value,
                        }))
                      }
                      className="h-11 border-slate-200 pl-9"
                    />
                  </div>
                </SettingsField>
                </div>
              </section>

              <div className="sticky bottom-4 flex justify-end">
                <button
                  type="submit"
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="account-setting" className="pt-6">
            <div className="space-y-10">
              <form
                className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Keep your employer account secure with a stronger password.
                  </p>
                </div>
                <div className="grid gap-4 xl:grid-cols-3">
                  <PasswordField
                    label="Current Password"
                    value={accountInfo.currentPassword}
                    visible={showCurrentPassword}
                    onChange={(value) =>
                      setAccountInfo((current) => ({
                        ...current,
                        currentPassword: value,
                      }))
                    }
                    onToggleVisibility={() =>
                      setShowCurrentPassword((current) => !current)
                    }
                  />
                  <PasswordField
                    label="New Password"
                    value={accountInfo.newPassword}
                    visible={showNewPassword}
                    onChange={(value) =>
                      setAccountInfo((current) => ({
                        ...current,
                        newPassword: value,
                      }))
                    }
                    onToggleVisibility={() => setShowNewPassword((current) => !current)}
                  />
                  <PasswordField
                    label="Confirm Password"
                    value={accountInfo.confirmPassword}
                    visible={showConfirmPassword}
                    onChange={(value) =>
                      setAccountInfo((current) => ({
                        ...current,
                        confirmPassword: value,
                      }))
                    }
                    onToggleVisibility={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Change Password
                </button>
              </form>

              <section className="max-w-3xl rounded-3xl border border-rose-100 bg-white p-5 shadow-sm md:p-6">
                <h2 className="text-lg font-semibold text-slate-900">Delete Your Company</h2>
                <p className="text-sm leading-6 text-slate-500">
                  If you delete your Jobpilot account, you will no longer be able to get
                  information about the matched jobs, following employers, and job alert,
                  shortlisted jobs and more. You will be abandoned from all the services
                  of Jobpilot.com.
                </p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <CircleX className="h-4 w-4" />
                  Close Account
                </button>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
