// import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
       <>

               <div className="container mx-auto px-4 py-8">
                   <div className="mb-8">
                       <Skeleton className="h-10 w-48" />
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="lg:col-span-1 space-y-4">
                           <div className="space-y-4">
                               <Skeleton className="h-10 w-full" />
                               <Skeleton className="h-10 w-full" />
                           </div>

                           <div className="space-y-3">
                               {[...Array(5)].map((_, index) => (
                                   <div key={index} className="p-4 border rounded-lg">
                                       <div className="flex justify-between items-start">
                                           <div className="space-y-2">
                                               <Skeleton className="h-4 w-32" />
                                               <Skeleton className="h-3 w-24" />
                                           </div>
                                           <Skeleton className="h-3 w-16" />
                                       </div>
                                       <Skeleton className="h-3 w-full mt-3" />
                                       <Skeleton className="h-3 w-2/3 mt-1" />
                                   </div>
                               ))}
                           </div>
                       </div>

                       <div className="lg:col-span-2">
                           <div className="h-[600px] border rounded-lg p-6">
                               <div className="flex flex-col h-full justify-center items-center">
                                   <Skeleton className="h-16 w-16 rounded-full" />
                                   <Skeleton className="h-6 w-48 mt-4" />
                                   <Skeleton className="h-4 w-64 mt-2" />
                               </div>
                           </div>
                       </div>
                   </div>
               </div>

       </>
    )
}
