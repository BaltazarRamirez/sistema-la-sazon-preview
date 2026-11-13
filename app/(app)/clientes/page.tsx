import ListaClientes from '@/components/ListaClientes'
import { MOCK_CLIENTES, MOCK_PROGRAMA_ACTIVO } from '@/lib/mock/clientes'

export const dynamic = 'force-dynamic'

export default async function ClientesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">Clientes</h1>
        <p className="sub mt-1">{MOCK_CLIENTES.length} clientes registrados. Se cargan solos al registrar una venta con su WhatsApp.</p>
      </div>
      <ListaClientes clientes={MOCK_CLIENTES} programaActivo={MOCK_PROGRAMA_ACTIVO} />
    </div>
  )
}
