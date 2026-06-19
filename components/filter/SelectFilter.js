import React from 'react'
import { Form } from 'react-bootstrap'

const SelectFilter = ({ value = 10, onChange }) => {
  return (
    <div className='d-flex justify-content-center align-items-center gap-3'>
        <label>Show</label>
        <Form.Select
          className='select-filter'
          value={String(value)}
          onChange={onChange ? (e) => onChange(Number(e.target.value)) : undefined}
        >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
        </Form.Select>
    </div>
  )
}

export default SelectFilter
