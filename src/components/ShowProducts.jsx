import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ShowProducts = () => {
    // const url = 'https://backend-fiducia.onrender.com/api/products';
    const url = 'http://localhost:9000/api/products';

    const [products, setProducts] = useState([]);
    const [id, setId] = useState('');
    const [marca, setMarca] = useState('');
    const [producto, setProducto] = useState('');
    const [peso, setPeso] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [vencimiento, setVencimiento] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const response = await axios.get(url);
            setProducts(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const show_alerta = (mensaje, icono) => {
        MySwal.fire({
            title: mensaje,
            icon: icono,
        });
    };

    const validar = () => {
        if (marca.trim() === '') {
            show_alerta('Escribe la marca del producto', 'warning');
        } else if (producto.trim() === '') {
            show_alerta('Escribe el nombre del producto', 'warning');
        } else if (peso === '') {
            show_alerta('Escribe el peso del producto', 'warning');
        } else if (cantidad === '') {
            show_alerta('Escribe la cantidad de productos', 'warning');
        } else if (vencimiento === '') {
            show_alerta('Escribe el vencimiento del producto', 'warning');
        } else {
            const parametros = {
                id: id,
                marca: marca.trim(),
                producto: producto.trim(),
                peso: peso,
                cantidad: cantidad,
                vencimiento: vencimiento
            };
            const metodo = operation === 1 ? 'POST' : 'PUT';
            const agregadoUrl = operation === 1 ? '' : `/${id}`;
            enviarSolicitud(metodo, parametros, agregadoUrl);
        }
    };

    const enviarSolicitud = async (metodo, parametros, agregadoUrl = "") => {
        try {
            const response = await axios({
                method: metodo,
                url: url + agregadoUrl,
                data: parametros
            });

            if (response.status === 200 || response.status === 201) {
                if (metodo === 'POST' && 'PUT') {
                    show_alerta('Se agregó correctamente', 'success');
                }else if (metodo === 'DELETE') {
                    show_alerta('Se eliminó correctamente', 'success');
                }
                getProducts();
                closeModal();
            }
        } catch (error) {
            show_alerta('Error en la solicitud', 'error');
            console.log(error);
        }
    };

    const deleteProduct = (id, name) => {
        MySwal.fire({
            title: `¿Seguro de eliminar el producto ${name}?`,
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                enviarSolicitud('DELETE', { id: id }, `/${id}`);
            } else {
                show_alerta('El producto NO fue eliminado', 'info');
            }
        });
    };

    const openModal = (operation, id = '', marca = '', producto = '', peso = '', cantidad = '', vencimiento = '') => {
        setId(id);
        setMarca(marca);
        setProducto(producto);
        setPeso(peso);
        setCantidad(cantidad);
        setVencimiento(vencimiento);
        setOperation(operation);

        if (operation === 1) {
            setTitle('Registrar Producto');
        } else if (operation === 2) {
            setTitle('Editar Producto');
        }

        // Setear operation a 1 si estás agregando un nuevo producto
        if (operation === 1) {
            setOperation(1);
        } else if (operation === 2) {
            // Setear operation a 2 y pasar el ID cuando estás editando un producto
            setOperation(2);
            setId(id);
        }


        setModalVisible(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        month = month.length === 1 ? '0' + month : month;
        let day = date.getDate().toString();
        day = day.length === 1 ? '0' + day : day;
        return `${year}-${month}-${day}`;
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <div className='App'>
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className='fas fa-plus-circle'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 col-lg-8 offset-lg-2">
                        <table className="table table-bordered table-hover">
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
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{product.marca}</td>
                                        <td>{product.producto}</td>
                                        <td>{product.peso}</td>
                                        <td>{product.cantidad}</td>
                                        <td>{formatDate(product.vencimiento)}</td>
                                        <td>
                                            <button className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts' onClick={() => openModal(2, product.id, product.marca, product.producto, product.peso, product.cantidad, product.vencimiento)}>
                                                <i className='fas fa-edit'></i> Editar
                                            </button>
                                            &nbsp;
                                            <button onClick={() => deleteProduct(product._id, product.marca)} className='btn btn-danger'>
                                                <i className='fas fa-trash'></i> Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {modalVisible && (
                <div className="modal fade show" id='modalProducts' aria-hidden='true' style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <label className="h5">{title}</label>
                                <button type='button' className='btn-close' aria-label='Close' onClick={() => setModalVisible(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="hidden" id='id'></input>
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
                                    <input type="text" id='vencimiento' className='form-control' placeholder='Vencimiento aa-mm-dd' value={vencimiento}
                                        onChange={(e) => setVencimiento(e.target.value)} />
                                </div>
                                <div className="d-grid col-6 mx-auto">
                                    <button onClick={() => validar()} className='btn btn-success'>
                                        <i className='fa-solid fa-floppy-disk'></i> Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowProducts;
