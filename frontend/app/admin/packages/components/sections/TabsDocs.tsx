"use client";

import React, { useState } from "react";
import { Tabs, TabItem } from "@components/ui-elements/Tabs";
import {
    Layout,
    Gauge,
    Settings,
    User,
    Lock,
    Mail,
    Smartphone,
    Globe,
    Zap
} from "lucide-react";
import { ComponentPageView } from "../ComponentPageView";
import { DocSubSection } from "../DocSubSection";

export const TabsDocs = () => {
    const [demo1, setDemo1] = useState("tab1");
    const [demo2, setDemo2] = useState("tab1");
    const [demo3, setDemo3] = useState("tab1");
    const [demo4, setDemo4] = useState("tab1");
    const [demo5, setDemo5] = useState("tab1");
    const [demoV1, setDemoV1] = useState("tab1");
    const [demoV2, setDemoV2] = useState("tab1");
    const [demoSize, setDemoSize] = useState("tab2");
    const [demoAni1, setDemoAni1] = useState("tab1");
    const [demoAni2, setDemoAni2] = useState("tab1");
    const [demoAni3, setDemoAni3] = useState("tab1");
    const [demoAni4, setDemoAni4] = useState("tab1");
    const [demoAni5, setDemoAni5] = useState("tab1");
    const [demoAni6, setDemoAni6] = useState("tab1");
    const [demoAni7, setDemoAni7] = useState("tab1");

    const basicTabs: TabItem[] = [
        { label: "Overview", value: "tab1", icon: <Layout size={18} /> },
        { label: "Analytics", value: "tab2", icon: <Gauge size={18} /> },
        { label: "Settings", value: "tab3", icon: <Settings size={18} /> },
    ];

    const featureTabs: TabItem[] = [
        { label: "Profile", value: "tab1", icon: <User size={18} /> },
        { label: "Security", value: "tab2", icon: <Lock size={18} /> },
        { label: "Messages", value: "tab3", icon: <Mail size={18} /> },
    ];

    const techTabs: TabItem[] = [
        { label: "Mobile", value: "tab1", icon: <Smartphone size={18} /> },
        { label: "Web", value: "tab2", icon: <Globe size={18} /> },
        { label: "Performance", value: "tab3", icon: <Zap size={18} /> },
    ];

    return (
        <ComponentPageView
            title="Tabs"
            description="A premium, highly customizable tab component for navigating between different views. Supports multiple orientations, design variants, and integrated Framer Motion animations for a state-of-the-art user experience."
            code={`<Tabs 
    tabs={tabs} 
    activeTab={activeTab} 
    onChange={setActiveTab} 
    variant="glass" 
    orientation="horizontal" 
/>`}
            fullSource={`import { Tabs } from "@components/ui-elements/Tabs";
import { Layout, Gauge, Settings } from "lucide-react";
import { useState } from "react";

export default function TabsShowcase() {
    const [activeTab, setActiveTab] = useState("tab1");
    
    const tabs = [
        { label: "Overview", value: "tab1", icon: <Layout size={18} /> },
        { label: "Analytics", value: "tab2", icon: <Gauge size={18} /> },
        { label: "Settings", value: "tab3", icon: <Settings size={18} /> },
    ];

    return (
        <div className="space-y-12 p-4">
            {/* SECTION 1: DESIGN VARIANTS (HORIZONTAL) */}
            <div className="space-y-4">
                <p className="text-sm font-bold">Horizontal Variants</p>
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="glass" />
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="bordered" />
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="underline" />
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="gradient" fullWidth />
            </div>

            {/* SECTION 2: ORIENTATION (VERTICAL) */}
            <div className="space-y-4">
                <p className="text-sm font-bold">Vertical Orientation</p>
                <div className="flex gap-8">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} orientation="vertical" variant="pills" />
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} orientation="vertical" variant="underline" />
                </div>
            </div>

            {/* SECTION 3: SIZE OPTIONS */}
            <div className="space-y-4">
                <p className="text-sm font-bold">Sizes (sm, md, lg)</p>
                <div className="flex flex-col gap-4">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size="sm" variant="glass" />
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size="md" variant="glass" />
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size="lg" variant="glass" />
                </div>
            </div>

            {/* SECTION 4: ANIMATION TYPES */}
            <div className="space-y-4">
                <p className="text-sm font-bold">Animation Styles</p>
                <div className="flex flex-col gap-4">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} animationType="spring" />
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} animationType="bounce" />
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} animationType="smooth" />
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} animationType="elastic" />
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} animationType="pop" />
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} animationType="jelly" />
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} animationType="none" />
                </div>
            </div>
        </div>
    );
}`}
        >
            <div className="grid grid-cols-1 gap-y-12">
                <DocSubSection title="Variants (Horizontal)">
                    <div className="space-y-8 w-full">
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-muted-foreground/60 tracking-widest">Pills (Default)</p>
                            <Tabs tabs={basicTabs} activeTab={demo1} onChange={setDemo1} variant="pills" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-muted-foreground/60 tracking-widest">Glass</p>
                            <Tabs tabs={featureTabs} activeTab={demo2} onChange={setDemo2} variant="glass" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-muted-foreground/60 tracking-widest">Bordered</p>
                            <Tabs tabs={techTabs} activeTab={demo3} onChange={setDemo3} variant="bordered" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-muted-foreground/60 tracking-widest">Underline</p>
                            <Tabs tabs={basicTabs} activeTab={demo4} onChange={setDemo4} variant="underline" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-muted-foreground/60 tracking-widest">Gradient (Full Width)</p>
                            <Tabs tabs={featureTabs} activeTab={demo5} onChange={setDemo5} variant="gradient" fullWidth />
                        </div>
                    </div>
                </DocSubSection>

                <DocSubSection title="Orientation (Vertical)">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-muted-foreground/60 tracking-widest mb-4">Vertical Pills</p>
                            <div className="flex gap-6">
                                <Tabs tabs={basicTabs} activeTab={demoV1} onChange={setDemoV1} orientation="vertical" variant="pills" />
                                <div className="flex-1 min-h-[120px] rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
                                    Content: {demoV1}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-muted-foreground/60 tracking-widest mb-4">Vertical Underline</p>
                            <div className="flex gap-6">
                                <Tabs tabs={featureTabs} activeTab={demoV2} onChange={setDemoV2} orientation="vertical" variant="underline" />
                                <div className="flex-1 min-h-[120px] rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
                                    Content: {demoV2}
                                </div>
                            </div>
                        </div>
                    </div>
                </DocSubSection>

                <DocSubSection title="Size Options">
                    <div className="space-y-8 w-full">
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-muted-foreground/60 tracking-widest">Small (sm)</p>
                            <Tabs tabs={techTabs} activeTab={demoSize} onChange={setDemoSize} variant="glass" size="sm" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-muted-foreground/60 tracking-widest">Medium (md)</p>
                            <Tabs tabs={techTabs} activeTab={demoSize} onChange={setDemoSize} variant="glass" size="md" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-muted-foreground/60 tracking-widest">Large (lg)</p>
                            <Tabs tabs={techTabs} activeTab={demoSize} onChange={setDemoSize} variant="glass" size="lg" />
                        </div>
                    </div>
                </DocSubSection>

                <DocSubSection title="Animation Types">
                    <div className="grid grid-cols-1 gap-y-6 w-full">
                        <div className="space-y-3 p-4 rounded-2xl bg-muted/5 border border-border/40 hover:border-brand-primary/20 transition-colors duration-300 w-full">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">Spring (Default)</p>
                            <Tabs tabs={basicTabs} activeTab={demoAni1} onChange={setDemoAni1} variant="pills" animationType="spring" />
                        </div>
                        <div className="space-y-3 p-4 rounded-2xl bg-muted/5 border border-border/40 hover:border-brand-primary/20 transition-colors duration-300 w-full">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">Bounce</p>
                            <Tabs tabs={basicTabs} activeTab={demoAni2} onChange={setDemoAni2} variant="pills" animationType="bounce" />
                        </div>
                        <div className="space-y-3 p-4 rounded-2xl bg-muted/5 border border-border/40 hover:border-brand-primary/20 transition-colors duration-300 w-full">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">Smooth</p>
                            <Tabs tabs={basicTabs} activeTab={demoAni3} onChange={setDemoAni3} variant="pills" animationType="smooth" />
                        </div>
                        <div className="space-y-3 p-4 rounded-2xl bg-muted/5 border border-border/40 hover:border-brand-primary/20 transition-colors duration-300 w-full">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">Elastic</p>
                            <Tabs tabs={basicTabs} activeTab={demoAni5} onChange={setDemoAni5} variant="pills" animationType="elastic" />
                        </div>
                        <div className="space-y-3 p-4 rounded-2xl bg-muted/5 border border-border/40 hover:border-brand-primary/20 transition-colors duration-300 w-full">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">Pop</p>
                            <Tabs tabs={basicTabs} activeTab={demoAni6} onChange={setDemoAni6} variant="pills" animationType="pop" />
                        </div>
                        <div className="space-y-3 p-4 rounded-2xl bg-muted/5 border border-border/40 hover:border-brand-primary/20 transition-colors duration-300 w-full">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">Jelly</p>
                            <Tabs tabs={basicTabs} activeTab={demoAni7} onChange={setDemoAni7} variant="pills" animationType="jelly" />
                        </div>
                        <div className="space-y-3 p-4 rounded-2xl bg-muted/5 border border-border/40 hover:border-brand-primary/20 transition-colors duration-300 w-full">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">None</p>
                            <Tabs tabs={basicTabs} activeTab={demoAni4} onChange={setDemoAni4} variant="pills" animationType="none" />
                        </div>
                    </div>
                </DocSubSection>
            </div>
        </ComponentPageView>
    );
};
