import {Button} from "@/components/ui/button.tsx"
import {useEffect, useState} from "react";
import {ClientOnly} from "@tanstack/react-router";


// CLIENT ONLY CODE - STORE IN STORAGE
// To store in storage, serves to be able to refresh a page, and to still have the data. Useful when we dont want to write all the infos in the DB.
// So some components can be WRAPPED around some client-only components to be used more easily
export function LocalCountButton() {

    return (
        <ClientOnly>         {/* Client Only, is ONLY rendered on the client side */}
            <ClientSection/>
        </ClientOnly>
        )

}

// Wrapper Component for Client-Only section
function ClientSection() {

    const [count, setCount] = useState(loadCount);

    // Stores the data on screen to the storage
    useEffect(() => {
        localStorage.setItem("count", count.toString())
    }, [count]) // Does it everytime the "count" changes.


    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => {
                setCount((c) => c + 1);
            }}
        >
            {count}
        </Button>
    )
}

// Loads the data from storage to UI data
function loadCount() {
    const storedCount = localStorage.getItem("count")
    return storedCount ? parseInt(storedCount) : 0
}