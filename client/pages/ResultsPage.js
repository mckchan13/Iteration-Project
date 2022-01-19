import React from 'react'
import { useLocation } from 'react-router-dom'

const ResultsPage = () => {
    const location = useLocation()
    console.log('results:', location.state)
    return (
        <div>
            results
        </div>
    )
}

export default ResultsPage
