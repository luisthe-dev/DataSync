function Connection(){
    db = openDatabase("Sync", "1", "Sync Data", 1024*1024);
    
    db.transaction(function(tx){
        tx.executeSql("CREATE TABLE IF NOT EXISTS Data (Id INTEGER PRIMARY KEY ASC, Username VARCHAR(99) NOT NULL, Email VARCHAR(99) NOT NULL, Password VARCHAR(99) NOT NULL)", [], SuccessNote, ErrorNote);
    });
}

function Difference(PHP_Values){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM Data", [], function(tx, r){
            CheckData(PHP_Values, r.rows)
        }, ErrorNote);
    })
}

function CheckData(PHP_Values, JS_Values){
    if(PHP_Values.length > JS_Values.length){
        PHP_Values.forEach(Main => {
            db.transaction(function(tx){
                Id = Main['Id'];
                tx.executeSql("SELECT * FROM Data WHERE Id = ?", [Id], function(tx, r){
                    if(r.rows.length == 0){
                        Install(Main);
                    }
                }, ErrorNote);
            })
        });
    }else{
        PHP_Values.forEach(Main => {
            db.transaction(function(tx){
                Id = Main['Id'];
                tx.executeSql("SELECT * FROM Data WHERE Id = ?", [Id], function(tx, r){
                    if(r.rows.length != 0){
                        CheckDetails(Main, r.rows);
                    }
                }, ErrorNote);
            })
        });
    }
}

function CheckDetails(PHP, JS){
    db.transaction(function(tx){
        PHP_Username = PHP['Username'];
        PHP_Email = PHP['Email'];
        PHP_Password = PHP['Password'];
        JS_Username = JS.item(0).Username;
        JS_Email = JS.item(0).Email;
        JS_Password = JS.item(0).Password;
        JS_Id = JS.item(0).Id;
        console.log(JS_Id);
        if(PHP_Username != JS_Username || PHP_Password != JS_Password || PHP_Email != JS_Email){
            console.log('Something Is Different');
            tx.executeSql("UPDATE Data SET Username = '"+PHP_Username+"', Email = '"+PHP_Email+"', Password = '"+PHP_Password+"' WHERE Id = ?", [JS_Id], SuccessNote, ErrorNote);
        }
    })
}

function Install(Okay){
    db.transaction(function(tx){
        Username = Okay['Username'];
        Email = Okay['Email'];
        Password = Okay['Password'];
        tx.executeSql("INSERT INTO Data (Username, Email, Password) VALUES (?, ?, ?)", [Username, Email, Password], SuccessNote, ErrorNote);
    })
}

function ErrorNote(tx, r){
    console.log('Something Is Off.');
}

function SuccessNote(tx, r){
    console.log('We\'re Doing Good Here.');
}


$('document').ready(function(){
    Connection();
    $('#Button').on('click', function(){
        Ace = 'Sync';
        $.post(
            './online.php',
            {Ace},
            function (data){
                if(data == 'No_Data'){
                    console.log('No Data To Sync Right Now');
                }else{
                    Values = JSON.parse(data);
                    Difference(Values);
                }
            }
        );

    })
});