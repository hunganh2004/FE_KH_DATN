import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { chatService } from '@/services/chatService'
import { resolveImage } from '@/utils/image'
import { formatPrice } from '@/utils/format'

const WELCOME = { role: 'assistant', content: 'Xin chào! Tôi là trợ lý PetShop 🐾 Tôi có thể giúp bạn tra cứu đơn hàng, thông tin sản phẩm và đánh giá. Bạn cần hỗ trợ gì?', products: [] }

const QUICK_QUESTIONS = [
  'Đơn hàng của tôi ở đâu?',
  'Sản phẩm Royal Canin còn hàng không?',
  'Sản phẩm tôi quan tâm còn hàng không?',
]

// Render markdown đơn giản: **bold**, *italic*, - bullet, 1. numbered, \n xuống dòng
function FormattedMessage({ content }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Bullet list
        if (/^[-*•]\s+/.test(line)) {
          return (
            <div key={i} className="flex gap-1.5">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-60" />
              <span>{renderInline(line.replace(/^[-*•]\s+/, ''))}</span>
            </div>
          )
        }
        // Numbered list
        if (/^\d+\.\s+/.test(line)) {
          const num = line.match(/^(\d+)\./)[1]
          return (
            <div key={i} className="flex gap-1.5">
              <span className="shrink-0 font-semibold opacity-70">{num}.</span>
              <span>{renderInline(line.replace(/^\d+\.\s+/, ''))}</span>
            </div>
          )
        }
        // Heading (###)
        if (/^###\s+/.test(line)) {
          return <p key={i} className="font-bold text-sm">{renderInline(line.replace(/^###\s+/, ''))}</p>
        }
        // Empty line → spacing
        if (line.trim() === '') return <div key={i} className="h-1" />
        // Normal line
        return <p key={i}>{renderInline(line)}</p>
      })}
    </div>
  )
}

function renderInline(text) {
  // **bold** và *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

// Thẻ sản phẩm mini trong chat
function ProductCard({ product, onClose }) {
  const img = resolveImage(product.image_url)
  const price = product.sale_price ?? product.price
  return (
    <Link
      to={`/product/${product.pk_product_id}`}
      onClick={onClose}
      className="flex gap-2 bg-white border border-stone-200 rounded-xl p-2 hover:border-emerald-300 hover:shadow-sm transition-all"
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
        {img
          ? <img src={img} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-stone-300 text-xl">🐾</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-stone-800 line-clamp-2 leading-snug">{product.name}</p>
        <p className="text-xs font-bold text-emerald-600 mt-0.5">{formatPrice(price)}</p>
        <p className={`text-[10px] mt-0.5 ${product.stock > 0 ? 'text-stone-400' : 'text-red-400'}`}>
          {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
        </p>
      </div>
    </Link>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Auto scroll xuống cuối khi có tin nhắn mới hoặc khi mở chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'instant' }), 50)
    }
  }, [open])

  const sendMessage = async (text) => {
    const message = (text ?? input).trim()
    if (!message || loading) return

    setMessages(prev => [...prev, { role: 'user', content: message, products: [] }])
    setInput('')
    setLoading(true)

    try {
      const res = await chatService.send(message, history)
      const reply = res?.data?.reply || res?.reply || 'Xin lỗi, tôi không hiểu câu hỏi này.'
      const products = res?.data?.products || res?.products || []

      setMessages(prev => [...prev, { role: 'assistant', content: reply, products }])
      setHistory(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: reply },
      ])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
        products: [],
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleReset = () => {
    setMessages([WELCOME])
    setHistory([])
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[680px] flex flex-col bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500 text-white shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">Trợ lý PetShop</p>
              <p className="text-xs text-emerald-100">Luôn sẵn sàng hỗ trợ bạn</p>
            </div>
            <button
              onClick={handleReset}
              className="text-white/70 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
              title="Cuộc trò chuyện mới"
            >
              Mới
            </button>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble + product cards */}
                <div className="max-w-[82%] flex flex-col gap-2">
                  <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-white rounded-tr-sm'
                      : 'bg-stone-100 text-stone-800 rounded-tl-sm'
                  }`}>
                    {msg.role === 'user'
                      ? msg.content
                      : <FormattedMessage content={msg.content} />
                    }
                  </div>

                  {/* Product cards */}
                  {msg.role === 'assistant' && msg.products?.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      {msg.products.map((p) => (
                        <ProductCard key={p.pk_product_id} product={p} onClose={() => setOpen(false)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pt-3 pb-2 border-t border-stone-100 shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi..."
                disabled={loading}
                rows={1}
                className="flex-1 resize-none border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent disabled:opacity-50 max-h-24 overflow-y-auto"
                style={{ lineHeight: '1.5' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 mt-1.5 text-center">Enter để gửi · Shift+Enter xuống dòng</p>
            {/* Thông tin liên hệ */}
            <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-center gap-3 text-[10px] text-stone-400">
              <span>Cần hỗ trợ thêm?</span>
              <a href="tel:1800xxxx" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                📞 0865 713 676
              </a>
              <a href="mailto:support@petshop.vn" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                ✉️ support@petshop.vn
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Mở chatbot"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  )
}
