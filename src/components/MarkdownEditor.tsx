'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Youtube from '@tiptap/extension-youtube'
import { Node } from '@tiptap/core'
import { createLowlight, common } from 'lowlight'
import TurndownService from 'turndown'
import { useEffect, useRef, useState } from 'react'

const lowlight = createLowlight(common)

// Custom Iframe Node extension to preserve all iframes (Facebook, etc.)
const IframeNode = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '100%' },
      height: { default: '400' },
      frameborder: { default: '0' },
      allowfullscreen: { default: true },
    }
  },

  parseHTML() {
    return [{ tag: 'iframe' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', HTMLAttributes]
  },
})

interface MarkdownEditorProps {
  content: string
  onChange: (markdown: string) => void
}

// Configure turndown with error handling
const createTurndownService = () => {
  try {
    const service = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    })

    // Preserve iframes/videos in markdown
    service.addRule('iframe', {
      filter: 'iframe',
      replacement: function (content, node: any) {
        try {
          const src = node.getAttribute('src') || ''
          const width = node.getAttribute('width') || '100%'
          const height = node.getAttribute('height') || '400'
          return `\n<iframe src="${src}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>\n`
        } catch (error) {
          console.error('Error converting iframe:', error)
          return ''
        }
      },
    })

    return service
  } catch (error) {
    console.error('Error creating turndown service:', error)
    return new TurndownService()
  }
}

export default function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const previousContentRef = useRef<string>('')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoType, setVideoType] = useState<'youtube' | 'iframe'>('youtube')
  const turndownService = useRef(createTurndownService()).current
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        ccLanguage: 'vi',
        HTMLAttributes: {
          class: 'youtube-embed',
        },
      }),
      IframeNode,
    ],
    content: content || '<p>Start writing...</p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6 overflow-wrap-anywhere',
      },
      transformPastedHTML(html) {
        // Preserve iframes when pasting HTML
        try {
          return html
        } catch (error) {
          console.error('Error transforming pasted HTML:', error)
          return ''
        }
      },
      transformPastedText(text) {
        // Handle plain text paste - convert to paragraphs
        try {
          return text
        } catch (error) {
          console.error('Error transforming pasted text:', error)
          return ''
        }
      },
      handlePaste: (view, event, slice) => {
        // Let TipTap handle paste normally
        return false
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
    onUpdate: ({ editor }) => {
      try {
        const html = editor.getHTML()
        const markdown = turndownService.turndown(html)
        onChange(markdown)
      } catch (error) {
        console.error('Error converting to markdown:', error)
        // Try to fallback to plain text if markdown conversion fails
        try {
          const text = editor.getText()
          onChange(text)
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
        }
      }
    },
  })

  // Update editor content when prop changes (e.g., loading a different post)
  useEffect(() => {
    if (editor && content !== undefined && content !== previousContentRef.current) {
      try {
        // Set content safely
        if (content === '') {
          editor.commands.setContent('<p></p>')
        } else {
          editor.commands.setContent(content)
        }
        previousContentRef.current = content
      } catch (error) {
        console.error('Error setting editor content:', error)
        // Fallback to empty paragraph if content is invalid
        editor.commands.setContent('<p></p>')
        previousContentRef.current = ''
      }
    }
  }, [content, editor])

  const handleInsertVideo = () => {
    if (!editor || !videoUrl) return

    if (videoType === 'youtube') {
      editor.commands.setYoutubeVideo({ src: videoUrl })
    } else {
      // Insert iframe as HTML
      const iframeHtml = `<div class="iframe-wrapper"><iframe src="${videoUrl}" width="100%" height="400" frameborder="0" allowfullscreen></iframe></div>`
      editor.commands.insertContent(iframeHtml)
    }

    setVideoUrl('')
    setShowVideoModal(false)
  }

  if (!editor) {
    return <div className="p-4 text-gray-500">Loading editor...</div>
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg">
      {/* Toolbar */}
      <div className="border-b border-gray-300 dark:border-gray-700 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('bold')
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('italic')
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('code')
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          Code
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          Numbered
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('codeBlock')
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          Code Block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          Quote
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          HR
        </button>
        
        {/* Divider */}
        <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
        
        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-3 py-1 rounded text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-3 py-1 rounded text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          ↷ Redo
        </button>
        
        {/* Divider */}
        <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
        
        <button
          onClick={() => setShowVideoModal(true)}
          className="px-3 py-1 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          📹 Video
        </button>
        <button
          onClick={() => {
            if (confirm('Xóa toàn bộ nội dung?')) {
              editor.commands.clearContent()
              onChange('')
            }
          }}
          className="px-3 py-1 rounded text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          title="Clear all content"
        >
          🗑️ Clear
        </button>
      </div>

      {/* Video Insert Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowVideoModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Insert Video</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="youtube"
                    checked={videoType === 'youtube'}
                    onChange={() => setVideoType('youtube')}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">YouTube</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="iframe"
                    checked={videoType === 'iframe'}
                    onChange={() => setVideoType('iframe')}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Facebook/Other</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {videoType === 'youtube' ? 'YouTube URL' : 'Embed URL'}
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder={videoType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://www.facebook.com/...'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {videoType === 'youtube' 
                  ? 'Paste YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)'
                  : 'Paste embed iframe src URL from Facebook or other platforms'}
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowVideoModal(false)
                  setVideoUrl('')
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertVideo}
                disabled={!videoUrl}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="bg-white dark:bg-gray-900 overflow-auto max-h-[700px]">
        <EditorContent editor={editor} />
      </div>
      
      {/* Tips */}
      <div className="border-t border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
        💡 <strong>Tips:</strong> Paste text từ Word/Google Docs có thể gây lỗi. Nếu gặp vấn đề, sử dụng Ctrl+Shift+V (paste plain text) hoặc click "Clear" để reset.
      </div>
    </div>
  )
}
