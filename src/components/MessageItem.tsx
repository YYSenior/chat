import type { Accessor } from "solid-js"
import type { ChatMessage } from "../types"
import MarkdownIt from "markdown-it"
// @ts-ignore
import mdKatex from "markdown-it-katex"
import mdHighlight from "markdown-it-highlightjs"
import Clipboard from "./Clipboard"
import { preWrapperPlugin } from "../markdown"
import "../styles/message.css"
import { useCopyCode } from "../hooks"

interface Props {
  role: ChatMessage["role"]
  message: Accessor<string> | string
}

export default ({ role, message }: Props) => {
  useCopyCode()
  const roleClass = {
  system: "background-image: url('https://pic.imgdb.cn/item/642d7c3fa682492fcc929f95.png')",
  user: "background-image: url('https://pic.imgdb.cn/item/642d7c5fa682492fcc92d18b.png')",
  assistant: "background-image: url('https://pic.imgdb.cn/item/642d7c3fa682492fcc929f95.png')"
  }

  const htmlString = () => {
    const md = MarkdownIt({
      breaks: true,
      html: true
    })
      .use(mdKatex)
      .use(mdHighlight)
      .use(preWrapperPlugin)

    if (typeof message === "function") {
      return md.render(message().trim())
    } else if (typeof message === "string") {
      return md.render(message.trim())
    }
    return ""
  }

  // createEffect(() => {
  //   console.log(htmlString())
  // })

  return (
    <div
      class="flex py-2 gap-3 px-4 rounded-lg transition-colors md:hover:bg-slate/3 relative message-item"
      class:op-75={role === "user"}
    >
      <div
        class={`shrink-0 w-7 h-7 mt-4 rounded-full op-80 ${roleClass[role]}`}
      ></div>
      <div
        class="message prose text-slate break-words overflow-hidden"
        innerHTML={htmlString()}
      />
      <Clipboard
        message={(() => {
          if (typeof message === "function") {
            return message().trim()
          } else if (typeof message === "string") {
            return message.trim()
          }
          return ""
        })()}
      />
    </div>
  )
}
