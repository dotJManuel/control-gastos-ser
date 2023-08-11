import { object } from 'prop-types'
import { useState, useEffect } from 'react'
import Header from "./components/Header"
import ListadoGastos from './components/ListadoGastos'
import Filtros from './components/Filtros'
import Modal from './components/Modal'
import ResponseMessage from './components/ResponseMessage';
import { generarId, saveCloud, responseGit } from './helpers'
import IconoNuevoGasto from './img/nuevo-gasto.svg'
import IconSync from './img/icon_sync.svg'
import IconSaveCloud from './img/icon-download.svg'

function App() {

  // const [gastos, setGastos] = useState([]);

  // useEffect(() => {
  //   const obtenerGastos = async () => {
  //     const datos = await obtenerDatos();
  //     setGastos(datos);
  //   };
    
  //   obtenerGastos();
  // }, []);

  const [gastos, setGastos] = useState(
    localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
  )

  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  )
  const [isValidPresupuesto, setValidPresupuesto] = useState(false)
  const [modal, setModal] = useState(false)
  const [animarModal, setAnimarModal] = useState(false)
  const [gastoEditar, setGastoEditar] = useState({})
  const [filtro, setFiltro] = useState('')
  const [gastosFiltrados, setGastosFiltrados] = useState([])
  const [messageSuccess, setMessageSuccess] = useState('');
  const [messageError, setMessageError] = useState('');

  useEffect(() => {

    if (Object.keys(gastoEditar).length > 0) {
      setModal(true)

      setTimeout(() => {
        setAnimarModal(true)
      }, 500)
    }
  }, [gastoEditar])

  useEffect(() => {
    localStorage.setItem('presupuesto', presupuesto ?? 0)
  }, [presupuesto])

  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos) ?? [])
  }, [gastos])

  // useEffect(() => {
  //   const guardarGastos = async () => {
  //     await guardarDatos(gastos);
  //   };
  
  //   guardarGastos();
  // }, [gastos]);
  

  useEffect(() => {
    if (filtro) {
      const gastosFiltrados = gastos.filter(gasto => gasto.categoria === filtro)
      setGastosFiltrados(gastosFiltrados)
    }
  }, [filtro])

  useEffect(() => {
    const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0

    if (presupuestoLS > 0) {
      setValidPresupuesto(true)
    }
  }, [])

  const handleNuevoGasto = () => {
    setModal(true)
    setGastoEditar({})

    setTimeout(() => {
      setAnimarModal(true)
    }, 500)
  }

  const guardarGasto = gasto => {
    if (gasto.id) {
      const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState)
      setGastos(gastosActualizados)
      setGastoEditar({})
    } else {
      gasto.id = generarId()
      gasto.fecha = Date.now()
      setGastos([...gastos, gasto])
    }
    setAnimarModal(false)
    setTimeout(() => {
      setModal(false)
    }, 500);
  }

  const eliminarGasto = id => {
    const gastosActualizados = gastos.filter(gasto => gasto.id !== id)

    setGastos(gastosActualizados)
  }

  const handleSincronizar = () => {
    const obtenerGastos = async () => {
      const response = await responseGit();
      const presupuesto = Number(response.data.presupuesto);

      setValidPresupuesto(presupuesto <= 0 ? false : true);
      setPresupuesto(presupuesto);
      setGastos(response.data.gastos);

      if(response.code === 200)
        setMessageSuccess("Success");
      else
        setMessageError("Error");

      setTimeout(function () {
        setMessageSuccess('');
        setMessageError('');
      }, 3000);
    };
    
    obtenerGastos();
  }

  const handleSaveCloud = () => {

    const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0
    const localGastos = localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
    
    const guardarGastos = async () => {
      const newGastos = {
        presupuesto: presupuestoLS,
        gastos: localGastos
      }

      const response = await saveCloud(newGastos);
      console.log(response);
      if(response.code === 200)
        setMessageSuccess("Success");
      else 
        setMessageError('Error');

      setTimeout(function () {
        setShowResponse('');
        setMessageError('');
      }, 3000);
    };
  
    guardarGastos();
  }
  
  return (
    <div className={modal ? 'fijar' : ''}>
      <Header
        gastos={gastos}
        setGastos={setGastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setValidPresupuesto={setValidPresupuesto}
      />
      
      {isValidPresupuesto && (
        <>
          <main>
            <Filtros
              filtro={filtro}
              setFiltro={setFiltro}
            />
            <ListadoGastos
              gastos={gastos}
              setGastoEditar={setGastoEditar}
              eliminarGasto={eliminarGasto}
              filtro={filtro}
              gastosFiltrados={gastosFiltrados}
            />
          </main>
          <div className='nuevo-gasto'>
            <img
              src={IconoNuevoGasto}
              alt="Icono nuevo gasto"
              onClick={handleNuevoGasto}
            />
          </div>
        </>
      )}

      {modal && <Modal
        setModal={setModal}
        animarModal={animarModal}
        setAnimarModal={setAnimarModal}
        guardarGasto={guardarGasto}
        gastoEditar={gastoEditar}
        setGastoEditar={setGastoEditar}
      />
      }

      <div className='sincronizar'>
        <img
          src={IconSync}
          alt="Icono sincronizar"
          onClick={handleSincronizar}
        />
      </div>

      <div className='saveCloud'>
        <img
          src={IconSaveCloud}
          alt="Icono guardar"
          onClick={handleSaveCloud}
        />
      </div>

      {messageSuccess && <ResponseMessage tipo="success" >{messageSuccess}</ResponseMessage>}
      {messageError && <ResponseMessage tipo="error" >{messageError}</ResponseMessage>}

    </div>
  )
}

export default App
