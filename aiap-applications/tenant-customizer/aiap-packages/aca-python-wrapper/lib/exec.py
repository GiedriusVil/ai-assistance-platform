
import numpy as np
import importlib 
import json
import sys
import sklearn.metrics as sk
import sklearn.model_selection as skm

try:
    lines = sys.stdin.readlines()
    arguments = json.loads(lines[0])
    module     = importlib.import_module('sklearn.' + arguments[0])
    estimatorName  = arguments[1].pop(0) 
    estimatorFunc = eval('module.' + estimatorName)
    if len(arguments[2]) ==0 :
        if estimatorName == 'precision_recall_fscore_support':
            prfs = sk.precision_recall_fscore_support(arguments[1][0],arguments[1][1],average='weighted')
            ret_val = {
                "precision":prfs[0],
                "recall":prfs[1],
                "fscore":prfs[2],
                "support":prfs[3]
            }
            print(json.dumps(ret_val))
        elif(estimatorName == 'confusion_matrix'):
            confusion_matrix = sk.confusion_matrix(arguments[1][0],arguments[1][1],labels=arguments[1][2])
            print(confusion_matrix.tolist())

        elif(estimatorName == 'classification_report'):
            class_report = sk.classification_report(arguments[1][0],arguments[1][1],output_dict=True)
            print(json.dumps(class_report))
        else:
            estimator = estimatorFunc(*arguments[1])
            print(estimator)
            
    else:
        estimator = estimatorFunc(*arguments[1])
        methods = arguments[2]
        results = {}
        for i in range(0, len(methods)):
            methodName = methods[i].pop(0)
            
            params = []
            for k in range(0, len(methods[i])):
                param = np.array(methods[i][k])
                params.append(param)
            
            if(methodName == 'fit'):
                estimator.fit(*params)

            elif(methodName == 'split'):
                skf = skm.StratifiedKFold(n_splits = arguments[1][0], shuffle = True, random_state = 2)
                folds = []
                i = 0
                for train_index, test_index in skf.split(params[0],params[1]):
                    fold = {
                        "train": train_index.tolist(),
                        "test": test_index.tolist()
                    }
                    folds.append(fold)
                    i += 1
                print(json.dumps(folds))
            else:
                method = eval('estimator.' + methodName)
                data = method(*params)
                results[methodName] = data
                
        for data in results:
            results[data] = results[data]
            
except Exception as err:
    raise err
