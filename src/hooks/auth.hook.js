import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setUserId] = useState(null)
    const [empId, setEmpId] = useState(null)
    const [empName, setEmpName] = useState(null)
    const [empFilial, setEmpFilial] = useState(null)

    const login = useCallback((jwtToken, id, empId, empName, empFilial) => {
        setToken(jwtToken)
        setUserId(id)
        setEmpId(empId)
        setEmpName(empName)
        setEmpFilial(empFilial)
        setReady(true)

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, empId: empId, empName: empName, empFilial: empFilial
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setEmpId(null)
        setEmpName(null)
        setEmpFilial(null)
        setReady(false)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.userId, data.empId, data.empName, data.empFilial)
        }
//        setReady(true)
    }, [login])

    return {login, logout, token, userId, ready, empId, empName, empFilial}
}