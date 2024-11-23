import { EnvManager } from "@/app/components/EnvManager"

export default function EnvDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Dashboard</h1>
      <EnvManager />
    </div>
  )
}

