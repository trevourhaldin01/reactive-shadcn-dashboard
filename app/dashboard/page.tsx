
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"


// import data from "./data.json"

export default async function Page() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
  let data = []

  try {
    const res = await fetch(`${API_BASE_URL}/documents`)

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }

    data = await res.json()
  } catch (error) {
    console.error("Error fetching documents:", error)
  }
  return (
    
      
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      
  )
}
