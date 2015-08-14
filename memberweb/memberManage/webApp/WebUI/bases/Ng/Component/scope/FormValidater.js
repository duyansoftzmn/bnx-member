define(['NgNamespaceInit'], function(){
    SyApp.NG.factory("FormValidater", function() {

        var FormValidater = {
            tellErrForInput : function(isText, error, inputname, min, max){
                if(error.number == true){
                    return inputname.concat(" should be a valid number");
                }
                else if(error.required == true){
                    return inputname.concat(" is required");
                }
                else if(error.pattern == true){
                    return inputname.concat(" pattern is not valid")
                }
                else if(error.minlength == true){
                    return inputname.concat(" should be longer than ").concat(min).concat(isText?" characters":" digits");
                }
                else if(error.maxlength == true){
                    return inputname.concat(" cannot be longer than ").concat(max).concat(isText?" characters":" digits");
                }
                else if(error.min == true){
                    return inputname.concat(" should be larger than ").concat(min);
                }
                else if(error.max == true){
                    return inputname.concat(" should be smaller than ").concat(max);
                }
                return null;
            }
        };


        return FormValidater;
    });
});