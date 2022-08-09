const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError');
const uuid = require('uuid')
const path = require('path')

class DeviceController {
    async create(req, res, next) {

        try{
            const{name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            if(info){
                info = JSON.parse(info)
                info.forEach(i => {
                    DeviceInfo.create({
                        tittle:i.tittle,
                        description: i.description,
                        deviceId:device.id
                    })
                });
            }


      
            const device = await Device.create({name, price, brandId, typeId, img:fileName})
      
            return res.json(device)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
     

    }

           

    async getAll(req, res) {
        let {brandId, typeId, limit, pages} = req.query
        pages = pages || 1
        limit = limit || 9
        let offset = pages * limit - limit
        let device;
        if(!brandId && !typeId){
            device = await Device.findAndCountAll({limit, offset})
        }

        if(brandId && !typeId){
            device = await Device.findAndCountAll({where:{brandId}, limit, offset})
        }

        if(!brandId && typeId){
            device = await Device.findAndCountAll({where:{typeId}, limit, offset})
            
        }

        if(brandId && typeId){
            device = await Device.findAndCountAll({where:{brandId, typeId}, limit, offset})
            
        }
        return res.json(device)
    }

    async getOne(req, res) {

        const {id} = req.params
        const device = await Device.findOne({
            where:{id},
            include:[{model:DeviceInfo, as:'info'}]
        },
        )
        return res.json(device)
    
    }   

}

module.exports = new DeviceController()