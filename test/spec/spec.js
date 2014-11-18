function setupEmptyFixture(){
    jasmine.getFixtures().set('<div id="test"></div>');
}

function setupUlFixture(){
    jasmine.getFixtures().set('<ul id="test"><li>A<ul><li>AA<ul><li>003</li><li>004</li></ul></li><li>001</li><li>002</li></ul></li><li>B<ul><li>B</li><li>01</li><li>02</li></ul></li></ul>');
}


var data = [{"name":"A","type":"folder","children":[{"name":"001","ext":"txt","type":"file"},{"name":"002","ext":"txt","type":"file"},{"name":"AA","type":"folder","children":[{"name":"003","ext":"txt","type":"file"},{"name":"004","ext":"txt","type":"file"}]}]},{"name":"B","type":"folder","children":[{"name":"01","ext":"jpg","type":"file"},{"name":"02","ext":"jpg","type":"file"},{"name":"B","type":"folder","children":[]}]}],
    button;

function init(data, options){
    $.fx.off = true;

    return $("#test").filetree({
        data: data
    });
}

describe("filetree", function() {
    
    describe("Events", function() {

        beforeEach(function(){
            setupEmptyFixture();
            init(data);
            button = $('li.folder').eq(0).find('> button');
        });

        
        it("should trigger click events properly", function() {
            
            var spy_folder = spyOnEvent('#test', 'folder.click.filetree');
            var spy_file   = spyOnEvent('#test', 'file.click.filetree');

            $('li.folder:first > a').click();
            
            expect('folder.click.filetree').toHaveBeenTriggeredOn('#test');
            expect(spy_folder).toHaveBeenTriggered();

            $('li.file:first > a').click();
            
            expect('file.click.filetree').toHaveBeenTriggeredOn('#test');
            expect(spy_file).toHaveBeenTriggered();
        });


        it("should trigger open/close events", function() {
            
            var spy_open   = spyOnEvent('#test', 'folder.open.filetree');
            var spy_opened = spyOnEvent('#test', 'folder.opened.filetree');
            var spy_close  = spyOnEvent('#test', 'folder.close.filetree');
            var spy_closed = spyOnEvent('#test', 'folder.closed.filetree');

            button.trigger('click');

            expect('folder.open.filetree').toHaveBeenTriggeredOn('#test');
            expect(spy_open).toHaveBeenTriggered();
            
            expect('folder.opened.filetree').toHaveBeenTriggeredOn('#test');
            expect(spy_opened).toHaveBeenTriggered();
    
            button.trigger('click');

            expect('folder.close.filetree').toHaveBeenTriggeredOn('#test');
            expect(spy_close).toHaveBeenTriggered();

            expect('folder.closed.filetree').toHaveBeenTriggeredOn('#test');
            expect(spy_closed).toHaveBeenTriggered();
        });
        
    });

    describe("Methods", function(){
        beforeEach(function(){
            setupEmptyFixture();
            init(data);
            button = $('li.folder').eq(0).find('button');
        });

        it("should trigger open and close events", function(){

            //expect('#test').toBeEmpty();
        })
    });

    describe("Classes", function(){

        beforeEach(function(){
            setupEmptyFixture();
            init(data);
            button = $('li.folder').eq(0).find('button');
        });

        it("should assign proper classes", function(){

            folder = $('li.folder').eq(0);
            
            expect(folder).toHaveClass('is-collapsed');

            button.trigger('click');

            expect(folder).toHaveClass('is-expanded');
    
            button.trigger('click');

            expect(folder).toHaveClass('is-collapsed');
            
        })
    });

});
