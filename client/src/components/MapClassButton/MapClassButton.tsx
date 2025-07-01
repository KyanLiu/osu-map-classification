import type { Tag } from "../../constants/mapTags"

const MapClassButton = ({ tag, tagPick }: { tag: Tag; tagPick: (tag: Tag) => void }) => {
  return (
    <div>
      <button type="button" onClick={() => tagPick(tag)}>
        {tag}
      </button>
    </div>
  )
}

export default MapClassButton
