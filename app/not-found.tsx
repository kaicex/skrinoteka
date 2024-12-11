import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-[12rem] font-bold text-gray-800 leading-none tracking-tight">
          404
        </h1>
        <p className="text-4xl font-semibold text-gray-700 mb-6">
          Страница не найдена
        </p>
        <p className="text-xl text-gray-600 mb-10">
          Извините, но запрошенная вами страница больше не существует или была перемещена. 
          Возможно, вы ошиблись при наборе адреса или страница была удалена.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
