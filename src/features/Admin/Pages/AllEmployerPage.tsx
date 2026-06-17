

export default function AllEmployerPage() {
    const a = {
        name: 'mokot',
        age: '19'
    }
    const b = {
        ...a,
        school: 'RUPP'
    }
    const c = 'name'
    return (
        <>
            <div>
                {b.age}
            </div>
        </>
    )
}