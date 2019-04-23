
const blacklistFields = ["password", "__v"];

export function transformModel(context: any) {
    const transformed: any =  context.toObject();

    blacklistFields.forEach((field) => {
        delete transformed[field];
    });

    return transformed;
}
