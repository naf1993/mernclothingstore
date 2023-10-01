import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SearchScreen = () => {
    let [searchParams,setSearchParams] = useSearchParams()
    let term = searchParams.get('query')
  return (
    <div>{term}</div>
  )
}

export default SearchScreen