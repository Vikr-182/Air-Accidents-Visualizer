types = ["criminal","external","loss","airf","pilot","weather"]
for i in range(len(types)):
    file = open("../fetch/" + types[i] + ".txt")
    string = file.read()
    print("NOW" + types[i])
    print(string.split("\n"))
    print("RARA")
