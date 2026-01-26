import {Button} from "@/components/ui/button.tsx"
import {useEffect, useState} from "react";


// CLIENT ONLY CODE - STORE IN STORAGE
// To store in storage, serves to be able to refresh a page, and to still have the data. Useful when we dont want to write all the infos in the DB.
// So some components can be WRAPPED around some client-only components to be used more easily
export function LocalCountButton() {

    const [count, setCount] = useState(0);

    // Gets the data from storage to screen
    useEffect(() => {
        setCount(loadCount)
    }, []);

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