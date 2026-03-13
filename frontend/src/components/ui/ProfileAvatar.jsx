/**
 * ProfileAvatar — reusable avatar with fallback initial
 *
 * Props:
 *   src      — image URL
 *   name     — user name (for fallback initial)
 *   size     — 'sm' | 'md' | 'lg' | 'xl'  (default: 'md')
 *   rounded  — 'full' | 'xl' | '2xl'       (default: '2xl')
 *   ring     — boolean                      (default: false)
 *   onClick  — click handler
 */

const SIZES = {
  sm:  'w-8  h-8  text-sm',
  md:  'w-10 h-10 text-base',
  lg:  'w-14 h-14 text-xl',
  xl:  'w-20 h-20 text-3xl',
}

const ROUNDED = {
  full: 'rounded-full',
  xl:   'rounded-xl',
  '2xl':'rounded-2xl',
}

export default function ProfileAvatar({
  src,
  name     = 'U',
  size     = 'md',
  rounded  = '2xl',
  ring     = false,
  onClick,
  className = '',
}) {
  const initial = name?.[0]?.toUpperCase() || 'U'
  const sizeClass   = SIZES[size]   || SIZES.md
  const roundedClass= ROUNDED[rounded] || ROUNDED['2xl']

  return (
    <div
      onClick={onClick}
      className={`
        ${sizeClass} ${roundedClass}
        overflow-hidden flex-shrink-0 select-none
        ${ring ? 'ring-2 ring-ocean-200 dark:ring-ocean-800' : ''}
        ${onClick ? 'cursor-pointer hover:ring-ocean-400 transition-all' : ''}
        ${className}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={e => { e.target.style.display = 'none' }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br
                        from-ocean-400 to-ocean-600
                        flex items-center justify-center">
          <span className="text-white font-extrabold leading-none">
            {initial}
          </span>
        </div>
      )}
    </div>
  )
}
