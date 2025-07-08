import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center py-12 min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Sistema de Alimentación Escolar
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ministerio de Educación y Ciencias - Paraguay
            </p>
            
            <div className="space-x-4">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
              >
                Registrarse
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-600 border-t pt-6">
              <p className="font-medium mb-2">Usuarios de prueba:</p>
              <div className="text-xs space-y-1">
                <p>👨‍💼 admin@alimescolar.gov.py / password</p>
                <p>👩‍🏫 maria.gonzalez@escuela.edu.py / password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}