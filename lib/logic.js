
/**
* Sample transaction
* @param {test.AccountTransfer} accountTransfer
* @transaction
*/

async function AccountTransfer(accountTransfer){
    let currentuser = getCurrentParticipant()
    if(accountTransfer.from.getFullyQualifiedIdentifier() == currentuser.account.getFullyQualifiedIdentifier()){

    if(accountTransfer.from.balance < accountTransfer.amount){
        throw new Error("insufficient funds")
    }
    else{
   
    accountTransfer.from.balance -= accountTransfer.amount
    accountTransfer.to.balance += accountTransfer.amount

    return getAssetRegistry('test.Account')
    .then(function(assetRegistry){
        return assetRegistry.update(accountTransfer.from)
    })
    .then(function(){
        return getAssetRegistry('test.Account')
    })
    .then(function(assetRegistry){
        return assetRegistry.update(accountTransfer.to)
    })
    }
    }
    else{
        throw new Error("this is not the current user")
    }
}

/**
* Sample transaction
* @param {test.fundsTransfer} fundTransfer
* @transaction
*/
async function fundsTransfer(fundTransfer){
    
    let currentuser = getCurrentParticipant()
    if(fundTransfer.from.getFullyQualifiedIdentifier() == currentuser.wallet.getFullyQualifiedIdentifier()){

    if(fundTransfer.from.walletAmount < fundTransfer.fundAmount){
        throw new Error("insufficient amount in the manager wallet")
    }

    else{
       
        fundTransfer.from.walletAmount -= fundTransfer.fundAmount
        fundTransfer.fund.fundAmount += fundTransfer.fundAmount

        return getAssetRegistry('test.wallet')
        .then(function(assetRegistry){
            return assetRegistry.update(fundTransfer.from)
        })
        .then(function(){
            return getAssetRegistry('test.Funds')
        })
        .then(function(assetRegistry){
            return assetRegistry.update(fundTransfer.fund)
        })
    }    

   
       
}
   else{
       throw new Error("this is not the manager wallet")
   }

}

/**
* Sample transaction
* @param {test.salaryEmployees} se
* @transaction
*/
async function salaryEmployees(se){
    const employeeRegistry = await getParticipantRegistry('test.Employee')
        //check if the employee exists
    const employeeExists = await employeeRegistry.exists(se.employee.EmployeeId)
    if(employeeExists){

        const walletRegistry = await getAssetRegistry('test.wallet')
        //check if the wallet of employee exists or not
        const walletExists = await walletRegistry.exists(se.employee.wallet.walletId)
        
        if(walletExists){

    let currentuser = getCurrentParticipant()
    if(se.employee.wallet.getFullyQualifiedIdentifier() == currentuser.wallet.getFullyQualifiedIdentifier()){
    
    
        if(se.employee.salary > se.fund.fundAmount){
            throw new Error("insufficient amount in fund")
        }
        else if(se.employee.status == 'UNPAID'){
           
          	se.employee.wallet.walletAmount += se.employee.salary
            se.fund.fundAmount -= se.employee.salary
            se.employee.status = 'PAID'

            //updating the registries after the transaction 


            return getAssetRegistry('test.wallet')
            .then(function(assetRegistry){
                return assetRegistry.update(se.employee.wallet)
            })
            .then(function(){
                return getAssetRegistry('test.Funds')
            })
            .then(function(assetRegistry){
                return assetRegistry.update(se.fund)
            }).then(function(){
                return getParticipantRegistry('test.Employee')//updating the participant due to change in status
            })
            .then(function(participantRegistry){
                return participantRegistry.update(se.employee)
            })

            
            
        }  
        
        else{
            throw new Error("employee is already paid")
        }    
   
    }
    else{
        throw new Error("account invalid")
    }
    
}
else{
    throw new Error("wallet of employee does not exists")
}
   
}
else{
    throw new Error("employee does not exists")
}

   

}

/**
* Sample transaction
* @param {test.statusChange} sc
* @transaction
*/

async function statusChange(sc){
    const employeeRegistry = await getParticipantRegistry('test.Employee');
    var getEmployees = await employeeRegistry.getAll();
    
    for(let i=0; i<getEmployees.length; i++) {
        getEmployees[i].status = 'UNPAID';
        await employeeRegistry.update(getEmployees[i]);
    }
}

