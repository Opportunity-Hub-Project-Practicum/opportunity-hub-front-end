import { Search } from "lucide-react"

interface searchBox {
    search: string,
    setSearch: (value: string) => void
}
export default function SearchBox({ search, setSearch }: searchBox) {

    return (
        <search className="flex border border-slate-200 rounded-lg w-full gap-3 p-3 mb-5">
            {<Search className="text-primary" />}
            <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value) }}
                placeholder="Search"
                className=" outline-none text-gray-600"></input>
        </search>
    )
}