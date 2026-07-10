import React, { useContext, useState, useEffect, useRef } from 'react'
import UserContext from '../context/UserContext'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'
import { FolderPlus, X, ArrowRight, Users } from 'lucide-react'

/**
 * HOME — same token system as Login.jsx / Register.jsx / the
 * standalone project modal:
 *
 *   void      #0B0D10   base background
 *   surface   #14171B   panel / card background
 *   line      #23272C   hairline borders
 *   bone      #EDEBE6   primary text
 *   mute      #7C848C   secondary text
 *   signal    #8C7CFF   primary accent (electric violet)
 *
 * Functionality is unchanged from the original: same axios calls,
 * same UserContext, same navigate-with-state to /project.
 */

const Home = () => {
    const { user } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState("")
    const [project, setProject] = useState([])
    const [status, setStatus] = useState("idle") // idle | creating | error
    const inputRef = useRef(null)
    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        if (!projectName.trim()) {
            setStatus("error")
            return
        }
        setStatus("creating")
        axios.post('/api/projects/create', {
            name: projectName,
        })
            .then((res) => {
                console.log(res)
                setIsModalOpen(false)
                setStatus("idle")
                setProjectName("")
                // refresh the list so the new project shows up immediately
                // axios.get('/projects/all').then((res) => {
                //     setProject(res.data.projects)
                // }).catch(err => console.log(err))
            })
            .catch((error) => {
                console.log(error)
                setStatus("error")
            })
    }

    // useEffect(() => {
    //     axios.get('/projects/all').then((res) => {
    //         setProject(res.data.projects)
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }, [])

    // focus input + reset state whenever the modal opens
    useEffect(() => {
        if (isModalOpen) {
            setStatus("idle")
            const t = setTimeout(() => inputRef.current?.focus(), 50)
            return () => clearTimeout(t)
        }
    }, [isModalOpen])

    // close on Escape
    useEffect(() => {
        if (!isModalOpen) return
        const onKey = (e) => e.key === "Escape" && setIsModalOpen(false)
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isModalOpen])

    return (
        <main className="min-h-screen w-full bg-[#0B0D10] text-[#EDEBE6] font-sans px-8 py-10">
            {/* header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="font-mono text-[11px] tracking-widest text-[#7C848C] uppercase mb-1">
                        Console / Projects
                    </p>
                    <h1 className="font-display font-semibold text-2xl text-[#EDEBE6]">
                        Your projects
                    </h1>
                </div>
                {user?.email && (
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#4ADE80] animate-pulse" />
                        <span className="font-mono text-xs text-[#7C848C]">{user.email}</span>
                    </div>
                )}
            </div>

            {/* project grid */}
            <div className="projects flex flex-wrap gap-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex flex-col items-center justify-center gap-2 min-w-52 min-h-[128px]
                               border border-dashed border-[#3A4048] rounded-xl
                               text-[#7C848C] hover:text-[#8C7CFF] hover:border-[#8C7CFF]/50
                               transition-colors"
                >
                    <FolderPlus size={20} />
                    <span className="font-mono text-[12px] tracking-widest uppercase">
                        New project
                    </span>
                </button>

                {project.map((proj) => (
                    <div
                        key={proj._id}
                        onClick={() => {
                            navigate(`/project`, {
                                state: { project: proj }
                            })
                        }}
                        className="group flex flex-col justify-between gap-4 cursor-pointer min-w-52 min-h-[128px] p-5
                                   bg-[#14171B] border border-[#23272C] rounded-xl
                                   hover:border-[#3A4048] transition-colors"
                    >
                        <h2 className="font-display font-semibold text-[#EDEBE6] truncate">
                            {proj.name}
                        </h2>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#7C848C] uppercase tracking-wide">
                            <Users size={12} />
                            {proj.users.length} collaborator{proj.users.length === 1 ? "" : "s"}
                        </div>
                    </div>
                ))}
            </div>

            {/* create project modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="create-project-title"
                >
                    {/* backdrop */}
                    <div
                        className="absolute inset-0 bg-[#0B0D10]/80 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* panel */}
                    <div className="relative w-full max-w-[420px] bg-[#14171B] border border-[#23272C] rounded-xl shadow-2xl">
                        {/* faint dot grid, no gradient */}
                        <div
                            className="absolute inset-0 rounded-xl opacity-[0.08] pointer-events-none"
                            style={{
                                backgroundImage: "radial-gradient(#3A4048 1px, transparent 1px)",
                                backgroundSize: "22px 22px",
                            }}
                        />

                        {/* header */}
                        <div className="relative z-10 flex items-start justify-between px-6 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-md bg-[#8C7CFF]/10 border border-[#8C7CFF]/30 flex items-center justify-center">
                                    <FolderPlus size={16} className="text-[#8C7CFF]" />
                                </div>
                                <div>
                                    <p className="font-mono text-[11px] tracking-widest text-[#7C848C] uppercase">
                                        New_project
                                    </p>
                                    <h2
                                        id="create-project-title"
                                        className="font-display font-semibold text-lg text-[#EDEBE6] leading-tight"
                                    >
                                        Create project
                                    </h2>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Close"
                                className="text-[#7C848C] hover:text-[#EDEBE6] transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* form */}
                        <form onSubmit={createProject} noValidate className="relative z-10 px-6 pt-6 pb-6">
                            <label
                                htmlFor="projectName"
                                className="block font-mono text-[11px] tracking-widest text-[#7C848C] uppercase mb-2"
                            >
                                Project_name
                            </label>
                            <input
                                ref={inputRef}
                                id="projectName"
                                type="text"
                                value={projectName}
                                onChange={(e) => {
                                    setProjectName(e.target.value)
                                    if (status === "error") setStatus("idle")
                                }}
                                placeholder="e.g. support-agent-v2"
                                className="w-full bg-[#0B0D10] border border-[#23272C] rounded-lg px-4 py-3 text-[15px]
                                           text-[#EDEBE6] placeholder:text-[#4C5158] outline-none
                                           focus:border-[#8C7CFF]/60 focus:ring-1 focus:ring-[#8C7CFF]/30
                                           transition-colors"
                            />

                            {status === "error" ? (
                                <p className="font-mono text-[12px] text-[#F87171] mt-2">
                                    error: could not create project. check the name and try again.
                                </p>
                            ) : (
                                <p className="font-mono text-[12px] text-[#5B6169] mt-2">
                                    this becomes your agent&rsquo;s workspace identifier.
                                </p>
                            )}

                            {/* actions */}
                            <div className="flex items-center gap-3 mt-7">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 border border-[#23272C] rounded-lg py-3 text-[14px] text-[#EDEBE6]
                                               hover:border-[#3A4048] hover:bg-[#0B0D10] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={status === "creating"}
                                    className="flex-1 bg-[#8C7CFF] text-[#0B0D10] font-semibold text-[14px]
                                               rounded-lg py-3 flex items-center justify-center gap-2
                                               hover:bg-[#9C8FFF] active:bg-[#7C6BEF]
                                               disabled:opacity-60 disabled:cursor-not-allowed
                                               transition-colors"
                                >
                                    {status === "creating" ? (
                                        <>
                                            <span className="h-3.5 w-3.5 border-2 border-[#0B0D10]/40 border-t-[#0B0D10] rounded-full animate-spin" />
                                            Creating…
                                        </>
                                    ) : (
                                        <>
                                            Create
                                            <ArrowRight size={15} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Home