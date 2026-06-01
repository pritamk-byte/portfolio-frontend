'use client';
import { Terminal } from 'lucide-react';

export default function TerminalGuide() {
  return (
    <div className="w-full h-full bg-os-window text-os-text font-mono text-sm overflow-y-auto mac-scrollbar p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex items-center gap-3 mb-8 border-b border-os-border pb-4">
          <Terminal className="text-emerald-500" size={24} />
          <h1 className="text-xl font-bold text-zinc-100">Terminal Command Reference</h1>
        </div>

        <div className="space-y-6">
          <p className="text-zinc-400">
            Welcome to Pritam_OS. The terminal is a fully functional command-line interface connected to a live Java Spring Boot backend. Below is a list of commands and system shortcuts you can use to interact with the environment.
          </p>

          {/* Global Shortcuts */}
          <section>
            <h2 className="text-amber-400 font-bold mb-3 border-b border-os-border pb-1">System Shortcuts</h2>
            <ul className="space-y-2">
              <li><code className="text-blue-400 font-bold">Cmd + K</code> or <code className="text-blue-400 font-bold">Ctrl + K</code> <span className="text-zinc-500">- Launch global Spotlight Search overlay</span></li>
            </ul>
          </section>

          {/* Core Profile */}
          <section>
            <h2 className="text-emerald-400 font-bold mb-3 border-b border-os-border pb-1">Core Profile</h2>
            <ul className="space-y-2">
              <li><code className="text-blue-400 font-bold">whoami</code> <span className="text-zinc-500">- View current user role</span></li>
              <li><code className="text-blue-400 font-bold">skills</code> <span className="text-zinc-500">- List technical stack and proficiencies</span></li>
              <li><code className="text-blue-400 font-bold">contact</code> <span className="text-zinc-500">- Display contact information</span></li>
              <li><code className="text-blue-400 font-bold">resume</code> <span className="text-zinc-500">- Open resume document</span></li>
            </ul>
          </section>

          {/* OS Integration */}
          <section>
            <h2 className="text-emerald-400 font-bold mb-3 border-b border-os-border pb-1">System & OS</h2>
            <ul className="space-y-2">
              <li><code className="text-blue-400 font-bold">open &lt;app&gt;</code> <span className="text-zinc-500">- Launch GUI apps (e.g., open mail, open profile)</span></li>
              <li><code className="text-blue-400 font-bold">date</code> <span className="text-zinc-500">- Print current system date and time</span></li>
              <li><code className="text-blue-400 font-bold">cal</code> <span className="text-zinc-500">- Display an interactive calendar</span></li>
              <li><code className="text-blue-400 font-bold">uptime</code> <span className="text-zinc-500">- View system uptime</span></li>
              <li><code className="text-blue-400 font-bold">clear</code> <span className="text-zinc-500">- Clear terminal output</span></li>
            </ul>
          </section>

          {/* Mini-Games */}
          <section>
            <h2 className="text-orange-400 font-bold mb-3 border-b border-os-border pb-1">Mini-Games (Interactive)</h2>
            <ul className="space-y-2">
              <li><code className="text-blue-400 font-bold">play breach</code> <span className="text-zinc-500">- Number guessing firewall hack</span></li>
              <li><code className="text-blue-400 font-bold">play trace</code> <span className="text-zinc-500">- Mastermind logic puzzle</span></li>
              <li><code className="text-blue-400 font-bold">play decrypt</code> <span className="text-zinc-500">- Word unscramble challenge</span></li>
              <li><code className="text-blue-400 font-bold">play bypass</code> <span className="text-zinc-500">- Binary translation minigame</span></li>
            </ul>
          </section>

          {/* Easter Eggs */}
          <section>
            <h2 className="text-purple-400 font-bold mb-3 border-b border-os-border pb-1">Hidden Easter Eggs</h2>
            <ul className="space-y-2">
              <li><code className="text-blue-400 font-bold">sudo su</code> <span className="text-zinc-500">- Attempt administrator override</span></li>
              <li><code className="text-blue-400 font-bold">matrix</code> <span className="text-zinc-500">- Enter the simulation</span></li>
              <li><code className="text-blue-400 font-bold">rcb</code> <span className="text-zinc-500">- Check team loyalties</span></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}