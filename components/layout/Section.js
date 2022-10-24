export default function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-white opacity-40 font-mono text-sm">
        {title.toUpperCase()}
      </h3>
      {children}
    </div>
  )
}
