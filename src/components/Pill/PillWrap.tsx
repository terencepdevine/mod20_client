import { ReactNode } from "react"

const PillWrap: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="pill-wrap">{children}</div>
  )
}

export default PillWrap