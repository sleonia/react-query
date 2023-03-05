export const BackLink = ({ onClick }) => {
  return (
    <a onClick={() => onClick()} href="#">
      Back
    </a>
  )
}

export const PostLink = ({ title, id, onClick }) => {
  return (
    <a
      onClick={() => onClick(id)}
      href={`#${id}`}
      style={{
        display: "block",
        margin: "12px",
      }}
    >
      {title}
    </a>
  )
}

export const PostComponent = ({ title, body }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  )
}
