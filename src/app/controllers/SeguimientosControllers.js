const path = require('../../paths');
const { handleErrors } = require(`${path.SERVICES}/logger`);
const { Seguimiento, Categoria, Estado, SeguimientoTipo, Persona, Entrevista, Genero, DocumentoTipo } = require(`${path.DATABASE}/db`);

const nameController = "Seguimiento"

const attributes = [
  "id",
  "motivo",
  "created_at",
  "updated_at"
]

const includes = [
  {
    model: Categoria, as: 'categoria',
    attributes: ["id", "nombre"]
  }, {
    model: Estado, as: 'estado',
    attributes: ["id", "nombre", "color"]
  }, {
    model: SeguimientoTipo, as: 'seguimientoTipo',
    attributes: ["id", "nombre"]
  }, {
    model: Persona, as: 'orientador',
    attributes: ["id", "nombre"]
  }, {
    model: Persona, as: 'derivador',
    attributes: ["id", "nombre"]
  }, {
    model: Persona, as: 'entrevistado',
    attributes: ["id", "nombre", "apellido", "documento"],
    include: [
      {
        model: Genero,
        as: "genero",
        attributes: ["id", "nombre"]
      },
      {
        model: DocumentoTipo,
        as: "documentoTipo",
        attributes: ["id", "nombre"]
      },//agregar persona
    ]
  }
];


const create = async (req, res) => {
  try {
    const data = await Seguimiento.create(req.body);
    return res.status(201).json({
      data,
    });
  } catch (error) {
    handleErrors(error, 'create', nameController);
    return res.status(500).json({ error: error.message })
  }
}

const get = async (_, res) => {
  try {
    let data = await Seguimiento.findAll({
      attributes: attributes,
      include: includes,
    });

    return res.status(200).json({ data });

  } catch (error) {
    handleErrors(error,'get', nameController);
    return res.status(500).json({ error: error.message })
  }
}

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Seguimiento.findOne({
      where: { id: id },

      attributes: attributes,
      include: includes,
    });
    if (data) {
      return res.status(200).json({ data });
    }
    return res.status(404).send({ message: 'No existe Seguimiento con el id especificado' });
  } catch (error) {
    handleErrors(error, 'getById', nameController);
    return res.status(500).send({ error: error.message });
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Seguimiento.update(req.body, {
      where: { id: id }
    });
    if (updated) {
      const updatedData = await Seguimiento.findOne({ where: { id: id } });
      return res.status(200).json({ data: updatedData });
    }
    throw new Error('Seguimiento not found');
  } catch (error) {
    handleErrors(error, 'update', nameController);
    return res.status(500).send({ error: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Seguimiento.destroy({
      where: { id: id }
    });
    if (deleted) {
      return res.status(204).send({ message: "Seguimiento eliminado" });
    }
    throw new Error("Seguimiento no encontrado");
  } catch (error) {
    handleErrors(error, 'destroy', nameController);
    return res.status(500).send({ error: error.message });
  }
};

const getByOrientadorId = async (req, res) => {
  try {
    const { orientador_id } = req.params;
    const data = await Seguimiento.findAll({
      where: { orientador_id: orientador_id }
    });
    if (data) {
      return res.status(200).json({ data });
    }
    return res.status(404).send({ message: 'No existe Seguimiento con el orientador especificado' });
  } catch (error) {
    handleErrors(error, 'getByOrientadorId', nameController);
    return res.status(500).send({ error: error.message });
  }
}

const getBySeguimientoId = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Seguimiento.findOne({
      where: { id: id },
      attributes: attributes,
      include: includes
    });
    if (data) {
      return res.status(200).json({ data });
    }
    return res.status(404).send({ message: 'No existe Seguimiento con el id especificado' });
  } catch (error) {
    handleErrors(error, 'getBySeguimientoId', nameController);
    return res.status(500).send({ error: error.message });
  }
}

const getByCategoria = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID de la Categoria de los parámetros de la solicitud

    let data = await Categoria.findAll({
      attributes: [
        "id",
        "nombre",
        "categoria_id"
      ],
      include: {
        model: Categoria,
        as:"categoria",
        where: {
          id: id,
        },
        attributes: [], // Excluir los atributos del modelo Categoria 
      },  
    });

    return res.status(200).json({ data });
    
  } catch (error) {
    handleErrors(error, 'getByCategoria', nameController);   
    return res.status(500).json({ error: error.message })
  }
}

const getByEstado = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del Estado de los parámetros de la solicitud

    let data = await Estado.findAll({
      attributes: [
        "id",
        "nombre",
        "estado_id"
      ],
      include: {
        model: Estado,
        as:"estado",
        where: {
          id: id,
        },
        attributes: [], // Excluir los atributos del modelo Estado
      },  
    });

    return res.status(200).json({ data });
    
  } catch (error) {
    handleErrors(error, 'getByEstado', nameController);   
    return res.status(500).json({ error: error.message })
  }
}


const getByEntrevista = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID de la Entrevista de los parámetros de la solicitud

    let data = await Entrevista.findAll({
      attributes: [
        "id",
        "observaciones",
        "entrevista_id"
      ],
      include: {
        model: Entrevista,
        as:"entrevista",
        where: {
          id: id,
        },
        attributes: [], // Excluir los atributos del modelo Entrevista 
      },  
    });

    return res.status(200).json({ data });
    
  } catch (error) {
    handleErrors(error, 'getByEntrevista', nameController);   
    return res.status(500).json({ error: error.message })
  }
}


module.exports = {
  create,
  get,
  getById,
  update,
  destroy,
  getByEstado,
  getByOrientadorId,
  getBySeguimientoId,
  getByEntrevista,
  getByCategoria
}