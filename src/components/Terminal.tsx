'use client';
import { useState, useRef, useEffect } from 'react';

interface CommandHistory {
  type: 'input' | 'output' | 'error' | 'game' | 'success' | 'system' | 'orange';
  text: string;
}

// --- THE ULTIMATE COMMAND VAULT ---
const STATIC_COMMANDS: Record<string, CommandHistory[]> = {
  // Core Profile
  'whoami': [{ type: 'output', text: 'Pritam - Software Engineer & Backend Architect.' }],
  'cat about.txt': [{ type: 'output', text: 'I am a Software Engineer passionate about building scalable backends with Java and Spring Boot.' }],
  'skills': [{ type: 'output', text: 'Java, Spring Boot, PostgreSQL, SQL, Next.js, React, Pandas.' }],
  'contact': [{ type: 'output', text: 'Email: contact@pritam.dev | Location: India' }], // <-- Don't forget to put your real email here!
  'github': [{ type: 'output', text: 'Opening GitHub... (Link disabled in terminal mode)' }],
  'linkedin': [{ type: 'output', text: 'Opening LinkedIn... (Link disabled in terminal mode)' }],
  'resume': [{ type: 'output', text: 'Fetching PDF... Please use the standard UI buttons to download.' }],
  'connectalumni': [
    { type: 'system', text: 'Pinging ConnectAlumni servers...' },
    { type: 'system', text: 'Verifying database integrity...' },
    { type: 'success', text: 'Status: 🟢 Platform is Online and facilitating alumni networks.' }
  ],

  // OS & System Info (date and cal moved to dynamic handlers below)
  'uptime': [{ type: 'output', text: 'up 4 days, 13:37, 1 user, load average: 0.00, 0.01, 0.05' }],
  'uname -a': [{ type: 'output', text: 'Linux pritam-os 5.15.0-76-generic #83-Ubuntu SMP Wed Jun 21 10:23:27 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux' }],
  'hostname': [{ type: 'output', text: 'PRITAM-MAIN-SERVER' }],
  'systeminfo': [
    { type: 'system', text: 'Loading System Information...' },
    { type: 'output', text: 'Host Name:                 PRITAM-OS' },
    { type: 'output', text: 'OS Name:                   Custom Spring/Next Kernel' },
    { type: 'output', text: 'OS Version:                10.0.19045 N/A Build 19045' },
    { type: 'output', text: 'System Boot Time:          4 days ago' },
    { type: 'output', text: 'Total Physical Memory:     32,768 MB' },
    { type: 'output', text: 'Available Physical Memory: 14,245 MB' }
  ],

  // File System
  'ls': [{ type: 'output', text: 'about.txt   projects/   skills/   connectalumni.sh   resume.pdf' }],
  'pwd': [{ type: 'output', text: '/home/pritam/portfolio-os' }],
  'cd': [{ type: 'output', text: 'Directory changed.' }],
  'tree': [
    { type: 'output', text: '.' },
    { type: 'output', text: '├── about.txt' },
    { type: 'output', text: '├── connectalumni.sh' },
    { type: 'output', text: '├── projects' },
    { type: 'output', text: '│   ├── backend_api.jar' },
    { type: 'output', text: '│   └── database_schema.sql' },
    { type: 'output', text: '├── resume.pdf' },
    { type: 'output', text: '└── skills' },
    { type: 'output', text: '    ├── java.class' },
    { type: 'output', text: '    └── react.tsx' }
  ],
  'dir /s': [
    { type: 'system', text: 'Volume in drive C has no label.' },
    { type: 'output', text: 'Directory of C:\\Windows\\System32' },
    { type: 'output', text: '05/31/2026  12:00 AM    <DIR>          .' },
    { type: 'output', text: '05/31/2026  12:00 AM    <DIR>          ..' },
    { type: 'output', text: '05/31/2026  12:00 AM           412,160 cmd.exe' },
    { type: 'output', text: '05/31/2026  12:00 AM         2,112,000 kernel32.dll' },
    { type: 'output', text: '05/31/2026  12:00 AM         1,048,576 ntdll.dll' },
    { type: 'output', text: 'Total Files Listed:' },
    { type: 'output', text: '           3 File(s)      3,572,736 bytes' }
  ],

  // Network & Hacker Simulation
  'ping': [
    { type: 'output', text: 'Pinging 127.0.0.1 with 32 bytes of data:' },
    { type: 'output', text: 'Reply from 127.0.0.1: bytes=32 time<1ms TTL=64' },
    { type: 'output', text: 'Reply from 127.0.0.1: bytes=32 time<1ms TTL=64' },
    { type: 'output', text: 'Ping statistics for 127.0.0.1: Packets: Sent = 2, Received = 2, Lost = 0' }
  ],
  'ipconfig': [
    { type: 'output', text: 'Windows IP Configuration' },
    { type: 'output', text: 'Ethernet adapter Ethernet 2:' },
    { type: 'output', text: '   IPv4 Address. . . . . . . . . . . : 192.168.1.144' },
    { type: 'output', text: '   Subnet Mask . . . . . . . . . . . : 255.255.255.0' },
    { type: 'output', text: '   Default Gateway . . . . . . . . . : 192.168.1.1' }
  ],
  'netstat': [
    { type: 'output', text: 'Active Connections' },
    { type: 'output', text: '  Proto  Local Address          Foreign Address        State' },
    { type: 'output', text: '  TCP    127.0.0.1:8080         0.0.0.0:0              LISTENING' },
    { type: 'output', text: '  TCP    192.168.1.144:5432     aws.neon.tech:443      ESTABLISHED' },
    { type: 'output', text: '  TCP    192.168.1.144:49152    104.18.32.47:443       ESTABLISHED' }
  ],
  'arp -a': [
    { type: 'output', text: 'Interface: 192.168.1.144 --- 0x4' },
    { type: 'output', text: '  Internet Address      Physical Address      Type' },
    { type: 'output', text: '  192.168.1.1           a0-b1-c2-d3-e4-f5     dynamic' },
    { type: 'output', text: '  192.168.1.255         ff-ff-ff-ff-ff-ff     static' },
    { type: 'output', text: '  224.0.0.22            01-00-5e-00-00-16     static' }
  ],
  'tracert': [
    { type: 'system', text: 'Tracing route to target [142.250.190.46] over a maximum of 30 hops:' },
    { type: 'output', text: '  1    <1 ms    <1 ms    <1 ms  192.168.1.1' },
    { type: 'output', text: '  2    15 ms    14 ms    14 ms  10.14.0.1' },
    { type: 'output', text: '  3    22 ms    20 ms    21 ms  lag-14.ear2.Chicago2.Level3.net [4.69.142.1]' },
    { type: 'output', text: '  4    25 ms    24 ms    24 ms  142.250.190.46' },
    { type: 'success', text: 'Trace complete.' }
  ],
  
  // Dev Tools
  'vim': [{ type: 'error', text: 'Opening Vim... Wait, how do I exit this? (Just kidding, use the UI)' }],
  'nano': [{ type: 'output', text: 'Nano is for beginners. Real devs use Vim.' }],
  'git status': [{ type: 'success', text: 'On branch main. Your branch is up to date with origin/main. Nothing to commit.' }],
  'docker ps': [{ type: 'output', text: 'CONTAINER ID   IMAGE       COMMAND   CREATED   STATUS   PORTS   NAMES\n9b23f1a2c3d4   postgres   "docker-e…"  2 days ago   Up 2 days  5432/tcp  pritam-db' }],
  'mvn clean install': [
    { type: 'system', text: '[INFO] Scanning for projects...' },
    { type: 'system', text: '[INFO] Building com.pritam:portfolio-api 0.0.1-SNAPSHOT' },
    { type: 'success', text: '[INFO] BUILD SUCCESS' },
    { type: 'output', text: '[INFO] Total time: 0.001 s' }
  ],
  'java': [
    { type: 'system', text: 'Starting JVM...' },
    { type: 'system', text: 'Compiling classes...' },
    { type: 'error', text: 'Exception in thread "main" java.lang.NullPointerException' },
    { type: 'output', text: '...Just kidding. The backend is perfectly stable.' }
  ],
  'spring': [{ type: 'success', text: '🌱 Booting up the robust backend architecture...' }],

  // Instant Sudo
  'sudo su': [
    { type: 'system', text: 'Authenticating administrator privileges...' },
    { type: 'system', text: 'Bypassing local security policies...' },
    { type: 'success', text: '=========================================' },
    { type: 'success', text: 'ROOT ACCESS GRANTED.' },
    { type: 'success', text: 'Welcome back, Admin.' },
    { type: 'success', text: '=========================================' }
  ],
  
  // Fun, Memes & ASCII
  'fortune': [{ type: 'output', text: '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler' }],
  'sl': [
    { type: 'system', text: '      ====        ________                ___________ ' },
    { type: 'system', text: '  _D _|  |_______/        \\__I_I_____===__|_________| ' },
    { type: 'system', text: '   |(_)---  |   H\\________/ |   |        =|___ ___|   ' },
    { type: 'system', text: '   /     |  |   H  |  |     |   |         ||_| |_||   ' },
    { type: 'system', text: '  |      |  |   H  |__--------------------| [___] |   ' },
    { type: 'system', text: '  | ________|___H__/__|_____/[][]~\\_______|       |   ' },
    { type: 'system', text: '  |/ |   |-----------I_____I [][] []  D   |=======|__ ' }
  ],
  'matrix': [
    { type: 'success', text: '01010111 01100001 01101011 01100101' },
    { type: 'success', text: 'Wake up, Pritam...' },
    { type: 'success', text: 'The Matrix has you...' },
    { type: 'success', text: 'Follow the white rabbit. 🐇' }
  ],
  'rcb': [
    { type: 'error', text: '██████╗   ██████╗  ██████╗ ' },
    { type: 'error', text: '██╔══██╗ ██╔════╝  ██╔══██╗' },
    { type: 'error', text: '██████╔╝ ██║       ██████╔╝' },
    { type: 'error', text: '██╔══██╗ ██║       ██╔══██╗' },
    { type: 'error', text: '██║  ██║ ╚██████╗  ██████╔╝' },
    { type: 'success', text: '>>> Ee Sala Nu Cup Namdu! <<<' }
  ],
  'help': [
    { type: 'system', text: 'AVAILABLE COMMANDS:' },
    { type: 'system', text: '-------------------------------------------------------' },
    { type: 'output', text: '  OS & NET: ping, date, cal, uptime, systeminfo, netstat, arp -a, tracert' },
    { type: 'output', text: '  FILES:    ls, pwd, cd, tree, dir /s, open <app>' },
    { type: 'output', text: '  DEV:      vim, nano, git status, docker ps, java, spring, mvn clean install' },
    { type: 'output', text: '  PROFILE:  skills, whoami, contact, connectalumni' },
    { type: 'output', text: '  FUN:      matrix, rcb, sl, cowsay, fortune' },
    { type: 'system', text: '-------------------------------------------------------' },
    { type: 'orange', text: '  GAMES:    play breach, play decrypt, play bypass, play trace, play riddle' },
    { type: 'system', text: '-------------------------------------------------------' },
    { type: 'error',  text: '  ADMIN:    sudo su' }
  ],

  // --- EASTER EGGS ---
  'sudo make me a sandwich': [{ type: 'output', text: 'Okay. 🥪' }],
  'rm -rf node_modules': [
    { type: 'system', text: 'Deleting heaviest object in the known universe...' },
    { type: 'success', text: 'Success. Freed 8,492 TB of disk space.' }
  ],
  '42': [{ type: 'output', text: 'The Answer to the Ultimate Question of Life, the Universe, and Everything.' }]
};

const RIDDLES = [
  { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "ECHO" },
  { q: "I have keys but open no locks. I have space but no room. You can enter, but you can't go outside. What am I?", a: "KEYBOARD" },
  { q: "The more you code, the more of me there is. I hide in plain sight and break your logic. What am I?", a: "BUG" }
];

export default function InteractiveTerminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Multi-Game Engine State ---
  const [gameState, setGameState] = useState({
    active: false,
    gameType: '', 
    targetValue: '', 
    scrambledHint: '',
    attemptsLeft: 0,
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // --- PRODUCTION URL ---
        const response = await fetch('https://portfolio-backend-t2zv.onrender.com/api/terminal/history');
        if (response.ok) {
          const data = await response.json();
          const formattedHistory: CommandHistory[] = data.reverse().flatMap((log: any) => [
            { type: 'input', text: `visitor@pritam-os:~$ ${log.command}` },
            { type: 'output', text: log.response }
          ]);

          setHistory([
            { type: 'system', text: 'PRITAM-OS v2.0.0 initialized.' },
            { type: 'system', text: 'Type "help" to see available commands.' },
            { type: 'system', text: '--- RECOVERING PREVIOUS SESSION DATA ---' },
            ...formattedHistory,
            { type: 'success', text: '--- SESSION RESTORED ---' }
          ]);
        } else {
          setHistory([
            { type: 'system', text: 'PRITAM-OS v2.0.0 initialized.' },
            { type: 'system', text: 'Type "help" to see available commands.' }
          ]);
        }
      } catch (error) {
        setHistory([
          { type: 'system', text: 'PRITAM-OS v2.0.0 initialized.' },
          { type: 'system', text: 'Type "help" to see available commands.' }
        ]);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    });
  }, [history.length, isTyping]);

  const streamLines = async (lines: CommandHistory[]) => {
    setIsTyping(true);
    for (const line of lines) {
      const randomDelay = Math.floor(Math.random() * 300) + 100; 
      await new Promise(r => setTimeout(r, randomDelay));
      setHistory(prev => [...prev, line]);
    }
    setIsTyping(false);
  };

  const handleGameLogic = (command: string) => {
    const newAttempts = gameState.attemptsLeft - 1;

    // GAME 1: FIREWALL BREACH
    if (gameState.gameType === 'breach') {
      const guess = parseInt(command);
      if (isNaN(guess)) {
        setHistory(prev => [...prev, { type: 'error', text: 'INVALID INPUT: Please enter a numeric code.' }]);
        return;
      }
      const targetNumber = parseInt(gameState.targetValue);

      if (guess === targetNumber) {
        streamLines([
          { type: 'success', text: '=========================================' },
          { type: 'success', text: 'FIREWALL DEFEATED. NODE UNLOCKED.' },
          { type: 'success', text: '=========================================' },
          { type: 'system', text: 'Exiting game...' }
        ]);
        setGameState({ active: false, gameType: '', targetValue: '', scrambledHint: '', attemptsLeft: 0 });
      } else if (newAttempts === 0) {
        streamLines([
          { type: 'error', text: 'CRITICAL FAILURE: Security lockout triggered.' },
          { type: 'system', text: 'Exiting game...' }
        ]);
        setGameState({ active: false, gameType: '', targetValue: '', scrambledHint: '', attemptsLeft: 0 });
      } else {
        const hint = guess > targetNumber ? 'TOO HIGH' : 'TOO LOW';
        setHistory(prev => [...prev, { type: 'game', text: `[TRACE AT ${100 - (newAttempts * 14)}%] Code rejected. Hint: ${hint}. Attempts remaining: ${newAttempts}` }]);
        setGameState({ ...gameState, attemptsLeft: newAttempts });
      }
    }

    // GAME 2: DECRYPT PAYLOAD
    if (gameState.gameType === 'decrypt') {
      const guess = command.toUpperCase().trim();
      if (guess === gameState.targetValue) {
        streamLines([
          { type: 'success', text: 'PAYLOAD DECRYPTED SUCCESSFULLY.' },
          { type: 'system', text: 'Exiting game...' }
        ]);
        setGameState({ active: false, gameType: '', targetValue: '', scrambledHint: '', attemptsLeft: 0 });
      } else if (newAttempts === 0) {
        streamLines([
          { type: 'error', text: 'DECRYPTION FAILED: Payload corrupted.' },
          { type: 'system', text: 'Exiting game...' }
        ]);
        setGameState({ active: false, gameType: '', targetValue: '', scrambledHint: '', attemptsLeft: 0 });
      } else {
        setHistory(prev => [...prev, { type: 'game', text: `[WARN] Hash mismatch. Scrambled payload: ${gameState.scrambledHint}. Attempts remaining: ${newAttempts}` }]);
        setGameState({ ...gameState, attemptsLeft: newAttempts });
      }
    }

    // GAME 3: BINARY BYPASS
    if (gameState.gameType === 'bypass') {
      const guess = parseInt(command);
      if (guess.toString() === gameState.targetValue) {
        streamLines([
          { type: 'success', text: 'BINARY LOCK BYPASSED.' },
          { type: 'system', text: 'Exiting game...' }
        ]);
        setGameState({ active: false, gameType: '', targetValue: '', scrambledHint: '', attemptsLeft: 0 });
      } else if (newAttempts === 0) {
        streamLines([
          { type: 'error', text: 'BYPASS FAILED: Node locked permanently.' },
          { type: 'system', text: 'Exiting game...' }
        ]);
        setGameState({ active: false, gameType: '', targetValue: '', scrambledHint: '', attemptsLeft: 0 });
      } else {
        setHistory(prev => [...prev, { type: 'game', text: `[ERROR] Incorrect translation. Attempts remaining: ${newAttempts}` }]);
        setGameState({ ...gameState, attemptsLeft: newAttempts });
      }
    }

    // GAME 4: MASTERMIND TRACE
    if (gameState.gameType === 'trace') {
      const guess = command.trim();
      if (guess.length !== 3 || isNaN(parseInt(guess))) {
        setHistory(prev => [...prev, { type: 'error', text: 'INVALID INPUT: Enter exactly 3 digits.' }]);
        return;
      }
      
      const target = gameState.targetValue;
      if (guess === target) {
        streamLines([
          { type: 'success', text: '=========================================' },
          { type: 'success', text: 'ROGUE IP TRACED AND ISOLATED.' },
          { type: 'success', text: `Final coordinates: ${target}` },
          { type: 'success', text: '=========================================' },
          { type: 'system', text: 'Exiting game...' }
        ]);
        setGameState({ active: false, gameType: '', targetValue: '', scrambledHint: '', attemptsLeft: 0 });
      } else if (newAttempts === 0) {
        streamLines([
          { type: 'error', text: 'TRACE LOST: The target has vanished from the network.' },
          { type: 'system', text: 'Exiting game...' }
        ]);
        setGameState({ active: false, gameType: '', targetValue: '', scrambledHint: '', attemptsLeft: 0 });
      } else {
        let bulls = 0;
        let cows = 0;
        const targetArr = target.split('');
        const guessArr = guess.split('');
        
        for (let i = 0; i < 3; i++) {
          if (guessArr[i] === targetArr[i]) {
            bulls++;
            targetArr[i] = 'X'; 
            guessArr[i] = 'Y'; 
          }
        }
        for (let i = 0; i < 3; i++) {
          const index = targetArr.indexOf(guessArr[i]);
          if (index > -1) {
            cows++;
            targetArr[index] = 'X'; 
          }
        }
        
        setHistory(prev => [...prev, { type: 'game', text: `[ANALYSIS] Exact matches (Perfect): ${bulls} | Correct numbers in wrong spot (Partial): ${cows}. Attempts remaining: ${newAttempts}` }]);
        setGameState({ ...gameState, attemptsLeft: newAttempts });
      }
    }

    // GAME 5: SPHINX RIDDLE
    if (gameState.gameType === 'riddle') {
      const guess = command.toUpperCase().trim();
      if (guess.includes(gameState.targetValue)) {
        streamLines([
          { type: 'success', text: '=========================================' },
          { type: 'success', text: 'LOGIC VERIFIED. FIREWALL DISENGAGED.' },
          { type: 'success', text: '=========================================' },
          { type: 'system', text: 'Exiting game...' }
        ]);
        setGameState({ active: false, gameType: '', targetValue: '', scrambledHint: '', attemptsLeft: 0 });
      } else if (newAttempts === 0) {
        streamLines([
          { type: 'error', text: 'INCORRECT: The firewall remains sealed.' },
          { type: 'system', text: 'Exiting game...' }
        ]);
        setGameState({ active: false, gameType: '', targetValue: '', scrambledHint: '', attemptsLeft: 0 });
      } else {
        setHistory(prev => [...prev, { type: 'game', text: `[REJECTED] That is incorrect. Think like a machine. Attempts remaining: ${newAttempts}` }]);
        setGameState({ ...gameState, attemptsLeft: newAttempts });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTyping) return; 

    let userCommand = input.trim();
    if (!userCommand) return;
    
    const lowerCommand = userCommand.toLowerCase();

    let promptPrefix = 'visitor@pritam-os:~$';
    if (gameState.active) {
      if (gameState.gameType === 'breach') promptPrefix = 'breach_override:~$';
      else if (gameState.gameType === 'decrypt') promptPrefix = 'decrypt_hash:~$';
      else if (gameState.gameType === 'bypass') promptPrefix = 'binary_bypass:~$';
      else if (gameState.gameType === 'trace') promptPrefix = 'network_trace:~$';
      else if (gameState.gameType === 'riddle') promptPrefix = 'sphinx_node:~$';
    }

    setHistory(prev => [...prev, { type: 'input', text: `${promptPrefix} ${userCommand}` }]);
    setInput('');

    // Game Interception 
    if (gameState.active) {
      if (lowerCommand === 'abort') {
        setHistory(prev => [...prev, { type: 'system', text: 'Game aborted. Returning to main terminal.' }]);
        setGameState({ active: false, gameType: '', targetValue: '', scrambledHint: '', attemptsLeft: 0 });
        return;
      }
      handleGameLogic(lowerCommand);
      return;
    }

    // --- OS INTEGRATION: The 'open' command ---
    if (lowerCommand.startsWith('open ')) {
      const target = lowerCommand.substring(5).trim();
      const appMap: Record<string, string> = {
        'resume': 'resume', 'resume.pdf': 'resume',
        'profile': 'profile', 'system_profile': 'profile',
        'alumni': 'alumni', 'connectalumni': 'alumni',
        'esp': 'esp', 'esp_platform': 'esp',
        'mail': 'contact', 'contact': 'contact'
      };

      const appId = appMap[target];
      if (appId) {
        // Dispatches the event to HUD.tsx to physically open the window
        window.dispatchEvent(new CustomEvent('launch-app', { detail: appId }));
        streamLines([{ type: 'success', text: `Executing system call: Launching ${target}...` }]);
      } else {
        streamLines([{ type: 'error', text: `Error: Application '${target}' not found. Type 'ls' to see available apps.` }]);
      }
      return;
    }

    // Clear Screen
    if (lowerCommand === 'clear' || lowerCommand === 'cls') {
      setHistory([{ type: 'system', text: 'Terminal cleared.' }]);
      return;
    }

    // --- GAMES INITIATION ---
    if (lowerCommand === 'play breach') {
      const secretCode = Math.floor(Math.random() * 900) + 100;
      streamLines([
        { type: 'game', text: 'INITIATING NUMBER GUESSING MINIGAME...' },
        { type: 'game', text: 'Target is a 3-digit pin (100-999). Type "abort" to quit.' }
      ]);
      setGameState({ active: true, gameType: 'breach', targetValue: secretCode.toString(), scrambledHint: '', attemptsLeft: 7 });
      return;
    }
    if (lowerCommand === 'play decrypt') {
      const words = ['JAVA', 'PANDAS', 'ALUMNI', 'BACKEND', 'DATABASE'];
      const targetWord = words[Math.floor(Math.random() * words.length)];
      const scrambledWord = targetWord.split('').sort(() => 0.5 - Math.random()).join('');
      streamLines([
        { type: 'game', text: 'INITIATING WORD UNSCRAMBLE MINIGAME...' },
        { type: 'game', text: `Scrambled Word: [ ${scrambledWord} ]. Type the unscrambled word.` }
      ]);
      setGameState({ active: true, gameType: 'decrypt', targetValue: targetWord, scrambledHint: scrambledWord, attemptsLeft: 4 });
      return;
    }
    if (lowerCommand === 'play bypass') {
      const decimalValue = Math.floor(Math.random() * 27) + 5;
      const binaryValue = decimalValue.toString(2); 
      streamLines([
        { type: 'game', text: 'INITIATING BINARY MATH MINIGAME...' },
        { type: 'game', text: `Translate this binary sequence to a normal number: [ ${binaryValue} ]` }
      ]);
      setGameState({ active: true, gameType: 'bypass', targetValue: decimalValue.toString(), scrambledHint: binaryValue, attemptsLeft: 3 });
      return;
    }
    if (lowerCommand === 'play trace') {
      let digits = [0,1,2,3,4,5,6,7,8,9];
      digits.sort(() => 0.5 - Math.random());
      const secretSequence = digits.slice(0,3).join('');
      streamLines([
        { type: 'game', text: 'INITIATING MASTERMIND LOGIC MINIGAME...' },
        { type: 'game', text: 'Guess the 3-digit code (Numbers 0-9, no duplicates).' },
        { type: 'game', text: 'System will feedback exact matches and partial matches. You have 7 attempts.' }
      ]);
      setGameState({ active: true, gameType: 'trace', targetValue: secretSequence, scrambledHint: '', attemptsLeft: 7 });
      return;
    }
    if (lowerCommand === 'play riddle') {
      const randomRiddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
      streamLines([
        { type: 'game', text: 'INITIATING SPHINX MINIGAME.' },
        { type: 'game', text: `Riddle: "${randomRiddle.q}"` },
        { type: 'game', text: 'Input your answer. You have 3 attempts.' }
      ]);
      setGameState({ active: true, gameType: 'riddle', targetValue: randomRiddle.a, scrambledHint: '', attemptsLeft: 3 });
      return;
    }

    // --- DYNAMIC OS COMMANDS (date and cal) ---
    if (lowerCommand === 'date') {
      streamLines([{ type: 'output', text: new Date().toString() }]);
      return;
    }

    if (lowerCommand === 'cal') {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const calLines: CommandHistory[] = [
        { type: 'output', text: `      ${monthNames[month]} ${year}` },
        { type: 'output', text: 'Su Mo Tu We Th Fr Sa' }
      ];
      
      let currentLine = '   '.repeat(firstDay);
      for (let day = 1; day <= daysInMonth; day++) {
        currentLine += day.toString().padStart(2, ' ') + ' ';
        if (new Date(year, month, day).getDay() === 6 || day === daysInMonth) {
          calLines.push({ type: 'output', text: currentLine.trimEnd() });
          currentLine = '';
        }
      }
      
      streamLines(calLines);
      return;
    }

    // --- STATIC COMMANDS ---
    if (STATIC_COMMANDS[lowerCommand]) {
      streamLines(STATIC_COMMANDS[lowerCommand]);
      return;
    }
    
    // Custom handling for cowsay
    if (lowerCommand.startsWith('cowsay ')) {
      const msg = userCommand.substring(7);
      const border = '-'.repeat(msg.length + 4);
      streamLines([
        { type: 'output', text: ` ${border} ` },
        { type: 'output', text: `< ${msg} >` },
        { type: 'output', text: ` ${border} ` },
        { type: 'output', text: '        \\   ^__^' },
        { type: 'output', text: '         \\  (oo)\\_______' },
        { type: 'output', text: '            (__)\\       )\\/\\' },
        { type: 'output', text: '                ||----w |' },
        { type: 'output', text: '                ||     ||' }
      ]);
      return;
    }

    // Fallback to Java Backend
    setIsTyping(true);
    try {
      // --- PRODUCTION URL FIX ---
      const response = await fetch('https://portfolio-backend-t2zv.onrender.com/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: lowerCommand })
      });

      if (!response.ok) throw new Error('Server connection failed.');
      const data = await response.text();
      streamLines([{ type: 'output', text: data }]);

    } catch (error) {
      streamLines([
        { type: 'error', text: `bash: ${lowerCommand}: command not found` },
        { type: 'output', text: 'Type "help" to see available local commands, or ensure the live Java backend is awake.' }
      ]);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#000000] font-mono text-sm md:text-base flex flex-col">
      <style>{`
        .mac-scrollbar::-webkit-scrollbar { width: 8px; }
        .mac-scrollbar::-webkit-scrollbar-track { background: #000000; }
        .mac-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .mac-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
      
      <div ref={scrollContainerRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-2 mac-scrollbar pb-12">
        {history.map((line, i) => (
          // 👇 CHANGED FROM <div> TO <pre>
          <pre 
            key={i} 
            className={`
              ${line.type === 'input' ? 'text-zinc-400' : ''}
              ${line.type === 'output' ? 'text-os-text' : ''}
              ${line.type === 'system' ? 'text-zinc-500' : ''}
              ${line.type === 'error' ? 'text-red-500' : ''}
              ${line.type === 'game' ? 'text-orange-400 font-semibold' : ''}
              ${line.type === 'success' ? 'text-emerald-400 font-bold' : ''}
              ${line.type === 'orange' ? 'text-orange-400' : ''}
              whitespace-pre font-inherit m-0 
            `}
          >
            {line.text}
          </pre>
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-zinc-500 mt-2">
            <span className="w-2 h-4 bg-zinc-500 animate-pulse"></span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-4 flex gap-3 interactive">
          <span className={gameState.active ? 'text-orange-400 font-bold' : 'text-emerald-500'}>
            {gameState.active 
              ? (gameState.gameType === 'breach' ? 'breach_override:~$' : 
                 gameState.gameType === 'decrypt' ? 'decrypt_hash:~$' : 
                 gameState.gameType === 'bypass' ? 'binary_bypass:~$' : 
                 gameState.gameType === 'trace' ? 'network_trace:~$' : 
                 gameState.gameType === 'riddle' ? 'sphinx_node:~$' : '') 
              : 'visitor@pritam-os:~$'}
          </span>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 caret-zinc-100 w-full disabled:opacity-50"
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}