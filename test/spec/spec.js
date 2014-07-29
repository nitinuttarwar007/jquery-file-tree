function setupEmptyFixture(){
    jasmine.getFixtures().set('<div id="test"></div>');
}

function setupUlFixture(){
    jasmine.getFixtures().set('<ul id="test"></ul>');
}


var data = [{"name":"A","type":"folder","children":[{"name":"001","ext":"txt","type":"file"},{"name":"002","ext":"txt","type":"file"},{"name":"AA","type":"folder","children":[{"name":"003","ext":"txt","type":"file"},{"name":"004","ext":"txt","type":"file"}]}]},{"name":"B","type":"folder","children":[{"name":"01","ext":"jpg","type":"file"},{"name":"02","ext":"jpg","type":"file"},{"name":"B","type":"folder","children":[]}]}];

function init(data, options){
    return $("#test").filetree({
        data: data
    });
}

describe("filetree", function() {
    
    describe("Events", function() {

        beforeEach(function(){
            setupEmptyFixture();
            init(data).on('click.folder.filetree', function(ev){
                $(this).filetree('toggle', ev.target);
            }).on('closed.folder.filetree', function(ev){
                console.log('closed');
            });
            jasmine.clock().install();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it("should trigger click.folder.filetree on click", function() {
            
            var spy = spyOnEvent('li.folder:first a', 'click.folder.filetree');
            
            $('li.folder a').eq(0).trigger('click');
            
            expect('click.folder.filetree').toHaveBeenTriggeredOn('li.folder:first a');
            expect(spy).toHaveBeenTriggered();
        });

        it("should trigger click.file.filetree on click", function() {
            
            var spy = spyOnEvent('li.file:first a', 'click.file.filetree');
            
            $('li.file a').eq(0).trigger('click');
            
            expect('click.file.filetree').toHaveBeenTriggeredOn('li.file:first a');
            expect(spy).toHaveBeenTriggered();
        });

        it("should trigger open.folder.filetree before opening folder", function() {
            
            var spy = spyOnEvent('li.folder:first a', 'open.folder.filetree');
            
            $('li.folder a').eq(0).trigger('click');
            
            expect('open.folder.filetree').toHaveBeenTriggeredOn('li.folder:first a');
            expect(spy).toHaveBeenTriggered();
        });

        it("should trigger opened.folder.filetree after folder has opened", function() {
            
            var spy = spyOnEvent('li.folder:first a', 'opened.folder.filetree');
            
            $('li.folder a').eq(0).trigger('click');
            jasmine.clock().tick(400);
            expect('opened.folder.filetree').toHaveBeenTriggeredOn('li.folder:first a');
            expect(spy).toHaveBeenTriggered();
        });

        it("should trigger close.folder.filetree before closing folder", function() {
            
            var spy = spyOnEvent('li.folder:first a', 'close.folder.filetree');
            
            $('li.folder a').eq(0).trigger('click');

            setTimeout(function(){ 
                $('li.folder a').eq(0).trigger('click'); 
            }, 400)
            
            jasmine.clock().tick(400);

            expect('close.folder.filetree').toHaveBeenTriggeredOn('li.folder:first a');
            expect(spy).toHaveBeenTriggered();
        });

        it("should trigger closed.folder.filetree after folder has closed", function() {
            
            var spy = spyOnEvent('li.folder:first a', 'closed.folder.filetree');
            
            $('li.folder a').eq(0).trigger('click');
            
            setTimeout(function(){ 
                $('li.folder a').eq(0).trigger('click'); 
            }, 500);
            
            jasmine.clock().tick(400);
            jasmine.clock().tick(100);
            jasmine.clock().tick(401);

            expect('closed.folder.filetree').toHaveBeenTriggeredOn('li.folder:first a');
            expect(spy).toHaveBeenTriggered();
        });
        
    });
});