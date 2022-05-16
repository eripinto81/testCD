exports.token= function(token) {
    if(token != 'bb57810aa6acb1887ccecfc6809ecb67'){
        console.log('#negado! tentativa de acesso não autorizada!')
        return false
    }else{
        return true
    }
}