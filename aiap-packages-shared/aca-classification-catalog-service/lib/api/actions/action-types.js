/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ACTION_TYPES = {
    CATALOG_NEW: 'newCatalog',
    CATALOG_DELETE: 'deleteCatalog',
    CATALOG_IMPORT_FROM_FILE: 'importCatalogFromFile',
    SUB_CLASS_SAVE: 'saveSubClass',
    SUB_CLASS_DELETE: 'deleteSubClass',
    CLASS_DELETE: 'deleteClass',
    CLASS_SAVE: 'saveClass',
    FAMILY_DELETE: 'deleteFamily',
    FAMILY_SAVE: 'saveFamily',
    SEGMENT_DELETE: 'deleteSegment',
    SEGMENT_SAVE: 'saveSegment',
}

module.exports = {
    ACTION_TYPES,
}
