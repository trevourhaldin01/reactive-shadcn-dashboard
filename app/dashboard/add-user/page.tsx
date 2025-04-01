import { AddUserForm } from "@/components/add-user-form";

export default function Page(){
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
                <AddUserForm />
            </div>   
        </div>
    )
}