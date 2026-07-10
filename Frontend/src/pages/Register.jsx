import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Mic, Check, X } from "lucide-react";
import axios from '../config/axios';
import UserContext from "../context/UserContext";
import { useContext } from "react";
const LOG_LINES = [
  "provisioning workspace",
  "generating agent id",
  "reserving memory slot…",
  "ready to onboard",
];

function passwordChecks(pw) {
  return [
    { label: "8+ characters", pass: pw.length >= 8 },
    { label: "one number", pass: /\d/.test(pw) },
    { label: "one uppercase letter", pass: /[A-Z]/.test(pw) },
  ];
}

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | creating | error
  const [errorMsg, setErrorMsg] = useState("");
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setLogIndex((i) => (i + 1) % LOG_LINES.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const checks = passwordChecks(password);
  const allChecksPass = checks.every((c) => c.pass);

  const {setuser} = useContext(UserContext)
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setStatus("error");
      setErrorMsg("all fields are required.");
      return;
    }
    if (!allChecksPass) {
      setStatus("error");
      setErrorMsg("password does not meet requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMsg("passwords do not match.");
      return;
    }
    if (!agree) {
      setStatus("error");
      setErrorMsg("please accept the terms to continue.");
      return;
    }

    axios.post('/api/auth/register', {
      email, password
    }).then((res) => {
      console.log(res.data)
      localStorage.setItem('token', res.data.token)
      setuser(res.data.user)
    })
    setStatus("creating");

    // Replace with your real signup call.
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
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#3A4048 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative z-10 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-[#7C848C] uppercase">
            agent · provisioning
          </span>
        </div>

        <div className="relative z-10">
          <p className="font-mono text-xs tracking-widest text-[#7C848C] uppercase mb-6">
            Console / 02
          </p>
          <h1 className="font-display font-semibold text-[2.75rem] leading-[1.05] text-[#EDEBE6]">
            Give your
            <br />
            agent a
            <br />
            home.
          </h1>
          <p className="mt-6 max-w-xs text-[#7C848C] text-[15px] leading-relaxed">
            Create an account to spin up your own agent, keep its
            memory, and pick up every session where you left off.
          </p>

          <div className="mt-10 flex items-end gap-[3px] h-10">
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={i}
                className="w-[3px] bg-[#8C7CFF] rounded-full"
                style={{
                  height: `${8 + ((i * 37) % 32)}px`,
                  animation: `waveform 1.4s ease-in-out ${(i % 7) * 0.12}s infinite`,
                  opacity: 0.35 + ((i % 5) / 5) * 0.5,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 font-mono text-xs text-[#5B6169] space-y-1">
          <p className="text-[#7C848C]">$ agent init --new</p>
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
      {/* RIGHT — registration form                                   */}
      {/* ---------------------------------------------------------- */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="h-8 w-8 rounded-md bg-[#8C7CFF]/10 border border-[#8C7CFF]/30 flex items-center justify-center">
              <Mic size={15} className="text-[#8C7CFF]" />
            </div>
            <span className="font-mono text-xs tracking-widest text-[#7C848C] uppercase">
              agent · provisioning
            </span>
          </div>

          <p className="font-mono text-xs tracking-widest text-[#7C848C] uppercase mb-3">
            New account
          </p>
          <h2 className="font-display font-semibold text-3xl text-[#EDEBE6] mb-2">
            Create account<span className="text-[#8C7CFF]">.</span>
          </h2>
          <p className="text-[#7C848C] text-[15px] mb-9">
            Set up your credentials to start building with your agent.
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
              <label
                htmlFor="password"
                className="block font-mono text-[11px] tracking-widest text-[#7C848C] uppercase mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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

              {/* live password requirements */}
              {password.length > 0 && (
                <ul className="mt-2.5 space-y-1">
                  {checks.map((c) => (
                    <li
                      key={c.label}
                      className={`flex items-center gap-1.5 text-[12px] font-mono ${
                        c.pass ? "text-[#4ADE80]" : "text-[#5B6169]"
                      }`}
                    >
                      {c.pass ? <Check size={12} /> : <X size={12} />}
                      {c.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block font-mono text-[11px] tracking-widest text-[#7C848C] uppercase mb-2"
              >
                Confirm_password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-[#14171B] border border-[#23272C] rounded-lg px-4 py-3 pr-11 text-[15px]
                             text-[#EDEBE6] placeholder:text-[#4C5158] outline-none
                             focus:border-[#8C7CFF]/60 focus:ring-1 focus:ring-[#8C7CFF]/30
                             transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C848C] hover:text-[#EDEBE6] transition-colors"
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {status === "error" && (
              <p className="font-mono text-[12px] text-[#F87171]">
                error: {errorMsg}
              </p>
            )}

            {/* terms */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
              <span
                onClick={() => setAgree((v) => !v)}
                className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-[4px] border flex items-center justify-center transition-colors
                  ${
                    agree
                      ? "bg-[#8C7CFF] border-[#8C7CFF]"
                      : "bg-transparent border-[#3A4048]"
                  }`}
              >
                {agree && (
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
              <span className="text-[13px] text-[#7C848C] leading-snug">
                I agree to the{" "}
                <span className="text-[#EDEBE6]">Terms of Service</span> and{" "}
                <span className="text-[#EDEBE6]">Privacy Policy</span>
              </span>
            </label>

            {/* submit */}
            <button
              type="submit"
              disabled={status === "creating"}
              className="w-full mt-2 bg-[#8C7CFF] text-[#0B0D10] font-semibold text-[15px]
                         rounded-lg py-3 flex items-center justify-center gap-2
                         hover:bg-[#9C8FFF] active:bg-[#7C6BEF]
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition-colors"
            >
              {status === "creating" ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-[#0B0D10]/40 border-t-[#0B0D10] rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
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

          <button
            type="button"
            className="w-full border border-[#23272C] rounded-lg py-3 text-[14px] text-[#EDEBE6]
                       hover:border-[#3A4048] hover:bg-[#14171B] transition-colors"
          >
            Continue with GitHub
          </button>

          {/* login link */}
          <p className="text-center text-[14px] text-[#7C848C] mt-9">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#8C7CFF] hover:text-[#9C8FFF] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}