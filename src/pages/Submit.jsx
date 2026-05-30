import { useState } from 'react'
import { CheckCircle, Upload, DollarSign, Info } from 'lucide-react'
import { categories } from '../data/listings'
import { createSubmission, calcFee } from '../lib/api'

const CONDITIONS = [
  'New - Sealed',
  'Like New - Complete',
  'Graded - PSA 10',
  'Graded - PSA 9',
  'Graded - PSA 8',
  'Graded - PSA 7',
  'Graded - BGS 9.5',
  'Graded - BGS 9',
  'Graded - CGC 10',
  'Graded - CGC 9.5',
  'Graded - CGC 9',
  'Graded - CGC 3.0',
  'Raw - Near Mint',
  'Raw - Lightly Played',
  'Raw - Moderately Played',
  'Raw - VG',
  'Good - Complete',
  'Good - Used',
  'Heavy Play',
]

const STEPS = ['Item Details', 'Pricing', 'Contact & Submit']

export default function Submit() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    itemName: '', set: '', number: '', category: '', condition: '',
    askingPrice: '', notes: '', images: [],
    sellerName: '', email: '', paypalEmail: '', agreeToFees: false,
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [feeData, setFeeData] = useState(null)

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Fetch fee from backend when price changes
  const handlePriceChange = async (v) => {
    setField('askingPrice', v)
    const p = parseFloat(v)
    if (!isNaN(p) && p > 0) {
      try { setFeeData(await calcFee(p)) } catch {}
    } else { setFeeData(null) }
  }

  function validate(s) {
    const e = {}
    if (s === 0) {
      if (!form.itemName.trim()) e.itemName = 'Required'
      if (!form.category)        e.category = 'Required'
      if (!form.condition)       e.condition = 'Required'
    }
    if (s === 1) {
      if (!form.askingPrice || parseFloat(form.askingPrice) <= 0) e.askingPrice = 'Enter a valid price'
    }
    if (s === 2) {
      if (!form.email.trim())      e.email = 'Required'
      if (!form.sellerName.trim()) e.sellerName = 'Required'
      if (!form.agreeToFees)       e.agreeToFees = 'You must agree to the fee structure'
    }
    return e
  }

  async function next() {
    const e = validate(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    if (step < 2) { setStep(s => s + 1); return }

    // Final step — submit to backend
    setSubmitting(true)
    try {
      await createSubmission({
        card_name:    form.itemName,
        set_name:     form.set,
        card_number:  form.number,
        category:     form.category,
        condition:    form.condition,
        asking_price: parseFloat(form.askingPrice),
        description:  form.notes,
        seller_name:  form.sellerName,
        seller_email: form.email,
        paypal_email: form.paypalEmail,
      })
      setDone(true)
    } catch (err) {
      setErrors({ submit: err.message || 'Submission failed. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh' }} className="flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle size={56} className="mx-auto mb-5" style={{ color: '#4ade80' }} />
          <h2 className="text-2xl font-bold text-white mb-2">Submission Received</h2>
          <p style={{ color: '#6b7280' }} className="mb-2">
            We'll review <strong className="text-white">{form.itemName}</strong> and get back to you at <strong className="text-white">{form.email}</strong> within 24 hours.
          </p>
          <p style={{ color: '#6b7280', fontSize: 13 }} className="mb-6">
            Once approved, your listing will go live at your asking price of <strong className="text-white">${parseFloat(form.askingPrice).toLocaleString()}</strong>. You'll receive <strong className="text-white">${feeData?.sellerPayout ?? '—'}</strong> when it sells.
          </p>
          {feeData && (
          <div className="rounded-xl p-4 mb-6 text-sm text-left" style={{ background: '#ffffff08', border: '1px solid #ffffff10' }}>
            <div className="flex justify-between text-white mb-1"><span>Asking Price</span><span>${feeData.salePrice.toLocaleString()}</span></div>
            <div className="flex justify-between mb-1" style={{ color: '#6b7280' }}><span>Platform Fee (4% + $0.50)</span><span>-${feeData.platformFee}</span></div>
            <div className="flex justify-between font-bold" style={{ color: '#4ade80' }}><span>You Receive</span><span>${feeData.sellerPayout}</span></div>
          </div>
          )}
          <button
            onClick={() => { setDone(false); setStep(0); setForm({ itemName:'',set:'',number:'',category:'',condition:'',askingPrice:'',notes:'',images:[],sellerName:'',email:'',paypalEmail:'',agreeToFees:false }) }}
            className="text-sm font-semibold transition-colors hover:text-white"
            style={{ color: '#6b7280' }}
          >
            Submit another item
          </button>
        </div>
      </div>
    )
  }

  const inputStyle = { background: '#ffffff0a', border: '1px solid #ffffff18', color: 'white', borderRadius: 8, padding: '10px 12px', width: '100%', fontSize: 14, outline: 'none' }
  const errStyle   = { color: '#f87171', fontSize: 11, marginTop: 3 }
  const labelStyle = { color: '#9ca3af', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 5 }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-1">Submit an Item</h1>
          <p style={{ color: '#6b7280' }}>Set your own price. We review, list, and handle the sale.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={i <= step
                    ? { background: '#4f46e5', color: 'white' }
                    : { background: '#1f2937', color: '#6b7280' }}
                >
                  {i + 1}
                </div>
                <span className="text-xs mt-1 whitespace-nowrap" style={{ color: i <= step ? '#a5b4fc' : '#4b5563' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-2 mb-5" style={{ background: i < step ? '#4f46e5' : '#1f2937' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Item Details */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>Item / Card Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Charizard Holo"
                  value={form.itemName}
                  onChange={e => setField('itemName', e.target.value)}
                  style={inputStyle}
                />
                {errors.itemName && <p style={errStyle}>{errors.itemName}</p>}
              </div>
              <div>
                <label style={labelStyle}>Set / Series</label>
                <input
                  type="text"
                  placeholder="e.g. Base Set, 2003 Topps Chrome"
                  value={form.set}
                  onChange={e => setField('set', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>Card / Set Number</label>
                <input
                  type="text"
                  placeholder="e.g. 4/102, #111, 75257"
                  value={form.number}
                  onChange={e => setField('number', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <select
                  value={form.category}
                  onChange={e => setField('category', e.target.value)}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                {errors.category && <p style={errStyle}>{errors.category}</p>}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Condition *</label>
              <select
                value={form.condition}
                onChange={e => setField('condition', e.target.value)}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                <option value="">Select condition</option>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.condition && <p style={errStyle}>{errors.condition}</p>}
            </div>

            <div>
              <label style={labelStyle}>Description / Notes</label>
              <textarea
                rows={4}
                placeholder="Centering, surface condition, cert number for graded cards, known flaws..."
                value={form.notes}
                onChange={e => setField('notes', e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Photos</label>
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer"
                style={{ border: '2px dashed #ffffff18', background: '#ffffff06', padding: '32px 16px', textAlign: 'center' }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <Upload size={24} style={{ color: '#6b7280' }} />
                <p className="text-sm" style={{ color: '#6b7280' }}>
                  Click to upload photos &mdash; front, back, and any grading label
                </p>
                <p style={{ color: '#4b5563', fontSize: 11 }}>PNG, JPG, HEIC up to 20MB each</p>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => setField('images', Array.from(e.target.files).map(f => f.name))}
                />
              </div>
              {form.images.length > 0 && (
                <p className="text-xs mt-2" style={{ color: '#4ade80' }}>
                  {form.images.length} file{form.images.length > 1 ? 's' : ''} selected: {form.images.join(', ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Pricing */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-xl p-5" style={{ background: '#ffffff08', border: '1px solid #ffffff10' }}>
              <h3 className="font-bold text-white mb-1 text-sm">You set the price</h3>
              <p style={{ color: '#6b7280', fontSize: 13 }}>
                We list your item at exactly the price you set. Buyers pay that price. You receive your cut after our 4% + $0.50 platform fee is deducted — we never negotiate your price without your permission.
              </p>
            </div>

            <div>
              <label style={labelStyle}>Asking Price (USD) *</label>
              <div className="relative">
                <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={form.askingPrice}
                  onChange={e => handlePriceChange(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 32 }}
                />
              </div>
              {errors.askingPrice && <p style={errStyle}>{errors.askingPrice}</p>}
            </div>

            {/* Live fee breakdown */}
            {feeData && (
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #ffffff10' }}>
                <div className="px-5 py-3" style={{ background: '#0d0d1a', borderBottom: '1px solid #ffffff08' }}>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Fee Breakdown</span>
                </div>
                <div className="px-5 py-4 space-y-3" style={{ background: '#ffffff06' }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#9ca3af' }}>Your asking price</span>
                    <span className="text-white font-semibold">${feeData.salePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#9ca3af' }}>Platform fee (4% + $0.50)</span>
                    <span style={{ color: '#f87171' }}>-${feeData.platformFee}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold" style={{ borderColor: '#ffffff10' }}>
                    <span className="text-white">You receive</span>
                    <span style={{ color: '#4ade80', fontSize: 18 }}>${feeData.sellerPayout}</span>
                  </div>
                  <div className="rounded-lg px-4 py-3 space-y-1.5" style={{ background: '#0d0d1a' }}>
                    <div className="flex justify-between text-xs" style={{ color: '#d97706' }}>
                      <span>Goes to Ben's legal defense (60%)</span>
                      <span>${feeData.causeAmount}</span>
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: '#6b7280' }}>
                      <span>Operations (40%)</span>
                      <span>${feeData.opsAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 rounded-lg p-3" style={{ background: '#111827', border: '1px solid #ffffff0c' }}>
              <Info size={14} style={{ color: '#6b7280', marginTop: 1, flexShrink: 0 }} />
              <p style={{ color: '#6b7280', fontSize: 12 }}>
                Pricing tip: Check recently sold comparables on eBay or TCGPlayer before setting your price. Overpriced items sit unsold; underpriced items leave money on the table.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.sellerName}
                  onChange={e => setField('sellerName', e.target.value)}
                  style={inputStyle}
                />
                {errors.sellerName && <p style={errStyle}>{errors.sellerName}</p>}
              </div>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setField('email', e.target.value)}
                  style={inputStyle}
                />
                {errors.email && <p style={errStyle}>{errors.email}</p>}
              </div>
            </div>

            <div>
              <label style={labelStyle}>PayPal Email (for payouts)</label>
              <input
                type="email"
                placeholder="Same as above or different PayPal address"
                value={form.paypalEmail}
                onChange={e => setField('paypalEmail', e.target.value)}
                style={inputStyle}
              />
              <p style={{ color: '#4b5563', fontSize: 11, marginTop: 4 }}>Leave blank if same as email above. Stripe payout option coming soon.</p>
            </div>

            {/* Summary */}
            <div className="rounded-xl p-5 space-y-2" style={{ background: '#ffffff06', border: '1px solid #ffffff0e' }}>
              <h3 className="font-bold text-white text-sm mb-3">Submission Summary</h3>
              {[
                { label: 'Item',      value: form.itemName },
                { label: 'Set',       value: form.set || '—' },
                { label: 'Category',  value: categories.find(c => c.id === form.category)?.label || '—' },
                { label: 'Condition', value: form.condition },
                { label: 'Price',     value: `$${parseFloat(form.askingPrice || 0).toLocaleString()}` },
                { label: 'You get',   value: `$${fee.youGet}` },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span style={{ color: '#6b7280' }}>{row.label}</span>
                  <span className="text-white font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Fee agreement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreeToFees}
                onChange={e => setField('agreeToFees', e.target.checked)}
                className="mt-1"
                style={{ accentColor: '#4f46e5' }}
              />
              <span style={{ color: '#9ca3af', fontSize: 13 }}>
                I agree to PlaysWell's 4% + $0.50 platform fee. I understand that 60% of the fee goes to Reckless Ben's legal defense fund and 40% covers platform operations. I confirm I own this item and have the right to sell it.
              </span>
            </label>
            {errors.agreeToFees && <p style={errStyle}>{errors.agreeToFees}</p>}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid #ffffff10' }}>
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="text-sm font-semibold transition-colors hover:text-white" style={{ color: '#6b7280' }}>
              Back
            </button>
          ) : <div />}

          {errors.submit && (
            <p style={{ color: '#f87171', fontSize: 13 }} className="text-right">{errors.submit}</p>
          )}
          <button
            onClick={next}
            disabled={submitting}
            className="font-bold px-8 py-3 rounded-xl text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: '#4f46e5', color: 'white' }}
          >
            {submitting ? 'Submitting...' : step < 2 ? 'Continue' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
