import { useState, useEffect , useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Mic } from "lucide-react";
import axios from '../config/axios';
import UserContext from "../context/UserContext";

const LOG_LINES = [
  "handshake established",
  "verifying credentials",
  "loading agent memory…",
  "awaiting input",
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | authenticating | error
  const [logIndex, setLogIndex] = useState(0);

  const {setuser} = useContext(UserContext)



  useEffect(() => {
    const t = setInterval(() => {
      setLogIndex((i) => (i + 1) % LOG_LINES.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus("error");
      return;
    }
    axios.post('/api/auth/login',{
      email,
      password
    }).then((res) => {
      console.log(res.data)

      localStorage.setItem('token', res.data.token)
      setuser(res.data.user)


    }).catch((err) => {
      console.log(err.response.data)
    })
    setStatus("authenticating");

    // Replace with your real auth call.
    await new Promise((r) => setTimeout(r, 900));

    setStatus("idle");
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0D10] font-sans text-[#EDEBE6] flex">
      {/* ---------------------------------------------------------- */}
      {/* LEFT — agent signature panel (hidden on small screens)      */}
      {/* ---------------------------------------------------------- */}
      <aside className="hidden lg:flex lg:w-[46%] relative flex-col justify-between border-r border-[#23272C] px-14 py-12 overflow-hidden">
        {/* faint dot grid, no gradient */}
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#3A4048 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative z-10 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-[#7C848C] uppercase">
            agent · online
          </span>
        </div>

        <div className="relative z-10">
          <p className="font-mono text-xs tracking-widest text-[#7C848C] uppercase mb-6">
            Console / 01
          </p>
          <h1 className="font-display font-semibold text-[2.75rem] leading-[1.05] text-[#EDEBE6]">
            Your agent
            <br />
            remembers
            <br />
            everything.
          </h1>
          <p className="mt-6 max-w-xs text-[#7C848C] text-[15px] leading-relaxed">
            Sign in to resume context, review past runs, and pick up
            exactly where your agent left off.
          </p>

          {/* signature: live waveform */}
          <div className="mt-10 flex items-end gap-[3px] h-10">
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={i}
                className="w-[3px] bg-[#8C7CFF] rounded-full"
                style={{
                  height: `${8 + ((i * 37) % 32)}px`,
                  animation: `waveform 1.4s ease-in-out ${
                    (i % 7) * 0.12
                  }s infinite`,
                  opacity: 0.35 + ((i % 5) / 5) * 0.5,
                }}
              />
            ))}
          </div>
        </div>

        {/* fake system log, reinforces "agent" vibe */}
        <div className="relative z-10 font-mono text-xs text-[#5B6169] space-y-1">
          <p className="text-[#7C848C]">$ session --status</p>
          <p className="flex items-center gap-2">
            <span className="text-[#8C7CFF]">›</span>
            {LOG_LINES[logIndex]}
            <span className="inline-block w-[6px] h-[12px] bg-[#8C7CFF] animate-pulse ml-1" />
          </p>
        </div>

        <style>{`
          @keyframes waveform {
            0%, 100% { transform: scaleY(0.55); }
            50% { transform: scaleY(1); }
          }
        `}</style>
      </aside>

      {/* ---------------------------------------------------------- */}
      {/* RIGHT — sign-in form                                        */}
      {/* ---------------------------------------------------------- */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          {/* mobile-only brand mark */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="h-8 w-8 rounded-md bg-[#8C7CFF]/10 border border-[#8C7CFF]/30 flex items-center justify-center">
              <Mic size={15} className="text-[#8C7CFF]" />
            </div>
            <span className="font-mono text-xs tracking-widest text-[#7C848C] uppercase">
              agent · online
            </span>
          </div>

          <p className="font-mono text-xs tracking-widest text-[#7C848C] uppercase mb-3">
            Authentication
          </p>
          <h2 className="font-display font-semibold text-3xl text-[#EDEBE6] mb-2">
            Sign in<span className="text-[#8C7CFF]">.</span>
          </h2>
          <p className="text-[#7C848C] text-[15px] mb-9">
            Enter your credentials to reconnect with your agent.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* email */}
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-[11px] tracking-widest text-[#7C848C] uppercase mb-2"
              >
                Email_address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#14171B] border border-[#23272C] rounded-lg px-4 py-3 text-[15px]
                           text-[#EDEBE6] placeholder:text-[#4C5158] outline-none
                           focus:border-[#8C7CFF]/60 focus:ring-1 focus:ring-[#8C7CFF]/30
                           transition-colors"
              />
            </div>

            {/* password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="font-mono text-[11px] tracking-widest text-[#7C848C] uppercase"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="font-mono text-[11px] text-[#7C848C] hover:text-[#8C7CFF] transition-colors"
                >
                  forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-[#14171B] border border-[#23272C] rounded-lg px-4 py-3 pr-11 text-[15px]
                             text-[#EDEBE6] placeholder:text-[#4C5158] outline-none
                             focus:border-[#8C7CFF]/60 focus:ring-1 focus:ring-[#8C7CFF]/30
                             transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C848C] hover:text-[#EDEBE6] transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {status === "error" && (
              <p className="font-mono text-[12px] text-[#F87171]">
                error: email and password are required.
              </p>
            )}

            {/* remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
              <span
                onClick={() => setRemember((v) => !v)}
                className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors
                  ${
                    remember
                      ? "bg-[#8C7CFF] border-[#8C7CFF]"
                      : "bg-transparent border-[#3A4048]"
                  }`}
              >
                {remember && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="#0B0D10"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="text-[13px] text-[#7C848C]">
                Keep me signed in
              </span>
            </label>

            {/* submit */}
            <button
              type="submit"
              disabled={status === "authenticating"}
              className="w-full mt-2 bg-[#8C7CFF] text-[#0B0D10] font-semibold text-[15px]
                         rounded-lg py-3 flex items-center justify-center gap-2
                         hover:bg-[#9C8FFF] active:bg-[#7C6BEF]
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition-colors"
            >
              {status === "authenticating" ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-[#0B0D10]/40 border-t-[#0B0D10] rounded-full animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* divider */}
          <div className="flex items-center gap-4 my-8">
            <span className="h-px flex-1 bg-[#23272C]" />
            <span className="font-mono text-[11px] text-[#4C5158] uppercase tracking-widest">
              or
            </span>
            <span className="h-px flex-1 bg-[#23272C]" />
          </div>

          {/* alt sign-in */}
          <button
            type="button"
            className="w-full border border-[#23272C] rounded-lg py-3 text-[14px] text-[#EDEBE6]
                       hover:border-[#3A4048] hover:bg-[#14171B] transition-colors"
          >
            Continue with GitHub
          </button>

          {/* register link */}
          <p className="text-center text-[14px] text-[#7C848C] mt-9">
            Don&rsquo;t have an account?{" "}
            <Link
              to="/register"
              className="text-[#8C7CFF] hover:text-[#9C8FFF] font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}