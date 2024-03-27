import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../components/functions';

const ShowProducts = () => {
    const url = 'https://backend-fiducia.onrender.com/api/products';
    const [products, setProducts] = useState([]);
    const [id, setId] = useState('');
    const [marca, setMarca] = useState('');
    const [producto, setProducto] = useState('');
    const [peso, setPeso] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [vencimiento, setVencimiento] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        const respuesta = await axios.get(url);
        setProducts(respuesta.data);
    }
    const openModal = (op, id, marca, producto, vencimiento) => {
        setId('');
        setMarca('');
        setProducto('');
        setVencimiento('');
        setOperation(op);
        if (op === 1) {
            setTitle('Registrar Producto');
        }
        else if (op === 2) {
            setTitle('Editar Producto');
            setId(id);
            setMarca(marca);
            setProducto(producto);
            setVencimiento(vencimiento);
        }
        window.setTimeout(function () {
            document.getElementById('marca').focus();
        }, 500);
    }
    const validar = () => {
        var parametros;
        var metodo;
        if (marca.trim() === '') {
            show_alerta('Escribe la del producto', 'warning');
        }
        else if (producto.trim() === '') {
            show_alerta('Escribe la descripción del producto', 'warning');
        }
        else if (peso === '') {
            show_alerta('Escribe el peso del producto', 'warning');
        }
        else if (cantidad === '') {
            show_alerta('Escribe la cantidad del producto', 'warning');
        }
        else if (vencimiento === '') {
            show_alerta('Escribe el vencimiento del producto', 'warning');
        }
        else {
            if (operation === 1) {
                parametros = { marca: marca.trim(), producto: producto.trim(), peso: peso.trim(), cantidad: cantidad.trim(), vencimiento: vencimiento };
                metodo = 'POST';
            }
            else {
                parametros = { id: id, marca: marca.trim(), producto: producto.trim(), peso: peso.trim(), cantidad: cantidad.trim(), vencimiento: vencimiento };
                metodo = 'PUT';
            }
            envarSolicitud(metodo, parametros);
        }
    }
    const envarSolicitud = async (metodo, parametros) => {
        await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
            let tipo = respuesta.data[0];
            let msj = respuesta.data[1];
            show_alerta(msj, tipo);
            if (tipo === 'success') {
                document.getElementById('btnCerrar').click();
                getProducts();
            }
        })
            .catch(function (error) {
                show_alerta('Error en la solicitud', 'error');
                console.log(error);
            });
    }
    const deleteProduct = (id, marca) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el producto ' + marca + ' ?',
            icon: 'question', text: 'No se podrá dar marcha atrás',
            showCancelButton: true, 
            confirmButtonText: 'Si, eliminar', 
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                envarSolicitud('DELETE', { id: id });
            }
            else {
                show_alerta('El producto NO fue eliminado', 'info');
            }
        });
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>MARCA</th>
                                        <th>PRODUCTO</th>
                                        <th>PESO</th>
                                        <th>CANTIDAD</th>
                                        <th>VENCIMIENTO</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {products.map((product, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product.marca}</td>
                                            <td>{product.producto}</td>
                                            <td>{product.peso}</td>
                                            <td>{product.cantidad}</td>
                                            <td>{new Date(product.vencimiento).toLocaleDateString()}</td>
                                            <td>
                                                <button onClick={() => openModal(2, product.id, product.marca, product.producto, product.vencimiento)}
                                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteProduct(product.id, product.marca)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className="input-group mb-3">
                                    <span className='input-group-text'><i className='fas fa-tags'></i></span>
                                    <input type="text" id='marca' className='form-control' placeholder='Marca' value={marca}
                                        onChange={(e) => setMarca(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                    <span className='input-group-text'><i className='fas fa-box'></i></span>
                                    <input type="text" id='producto' className='form-control' placeholder='Producto' value={producto}
                                        onChange={(e) => setProducto(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                    <span className='input-group-text'><i className='fas fa-weight'></i></span>
                                    <input type="text" id='peso' className='form-control' placeholder='Peso' value={peso}
                                        onChange={(e) => setPeso(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                    <span className='input-group-text'><i className='fas fa-shopping-cart'></i></span>
                                    <input type="text" id='cantidad' className='form-control' placeholder='Cantidad' value={cantidad}
                                        onChange={(e) => setCantidad(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                    <span className='input-group-text'><i className='fas fa-calendar-alt'></i></span>
                                    <input type="text" id='vencimiento' className='form-control' placeholder='Vencimiento' value={vencimiento}
                                        onChange={(e) => setVencimiento(e.target.value)} />
                                </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowProducts