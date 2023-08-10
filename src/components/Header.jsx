import React from 'react'
import NuevoPresupuesto from './NuevoPresupuesto'
import ControlPresupuesto from './ControlPresupuesto'

const Header = ({ gastos, setGastos, presupuesto, setPresupuesto, isValidPresupuesto, setValidPresupuesto }) => {
    return (
        <header>
            <h1>Planificador de Gastos</h1>
           
            {isValidPresupuesto ? (

                <ControlPresupuesto
                    gastos={gastos}
                    setGastos={setGastos}
                    presupuesto={presupuesto}
                    setPresupuesto={setPresupuesto}
                    setValidPresupuesto={setValidPresupuesto}
                />

            ) : (
                <NuevoPresupuesto
                    presupuesto={presupuesto}
                    setPresupuesto={setPresupuesto}
                    setValidPresupuesto={setValidPresupuesto}
                />
            )}

        </header>
    )
}

export default Header